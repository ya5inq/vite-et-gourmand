import { inject, injectable } from 'inversify';

import { AppErrorCodes } from '@/application/errors/app.error.interface';
import { CalculateDeliveryPriceUseCaseInterface } from '@/application/useCases/deliveryZone/calculateDeliveryPrice/calculateDeliveryPrice.useCase.interface';
import { MenuInterface } from '@/domain/entities/menu/menu.entity.interface';
import { OrderInterface } from '@/domain/entities/order/order.entity.interface';
import { OrderHistoryInterface } from '@/domain/entities/orderHistory/orderHistory.entity.interface';
import { OrderItemInterface } from '@/domain/entities/orderItem/orderItem.entity.interface';
import { AnalyticsRepositoryInterface } from '@/domain/interfaces/adapters/analytics.repository.interface';
import { MailSenderInterface } from '@/domain/interfaces/adapters/mailSender.interface';
import { LoggerInterface } from '@/domain/interfaces/logger/logger.interface';
import { MenuRepositoryInterface } from '@/domain/interfaces/repositories/menu.repository.interface';
import {
  CreateOrderPayloadInterface,
  OrderRepositoryInterface,
  StockUpdateInterface,
} from '@/domain/interfaces/repositories/order.repository.interface';

import { AppError } from '@/application/errors/app.error';
import { TYPES } from '@/configuration/di/types';
import { OrderStatusEnum } from '@/domain/entities/order/orderStatus';

import { CreateOrderDataInterface, CreateOrderUseCaseInterface } from './createOrder.useCase.interface';

/** Number of extra guests above `minPersons` that unlocks the 10% discount. */
export const DISCOUNT_THRESHOLD_OFFSET = 5;
export const DISCOUNT_RATE = 0.1;

export const round2 = (value: number): number => Math.round(value * 100) / 100;

export interface LineComputationResult {
  unitPrice: number;
  lineTotal: number;
  discountApplied: boolean;
}

/**
 * Computes a single order line price.
 *  - base = menu.price * quantity
 *  - 10% discount when quantity >= menu.minPersons + 5
 */
export const computeLine = (menu: MenuInterface, quantity: number): LineComputationResult => {
  const base = round2(menu.price * quantity);
  const discountApplied = quantity >= menu.minPersons + DISCOUNT_THRESHOLD_OFFSET;
  const lineTotal = discountApplied ? round2(base * (1 - DISCOUNT_RATE)) : base;
  return { unitPrice: menu.price, lineTotal, discountApplied };
};

@injectable()
export class CreateOrderUseCase implements CreateOrderUseCaseInterface {
  constructor(
    @inject(TYPES.OrderRepository) private orderRepository: OrderRepositoryInterface,
    @inject(TYPES.MenuRepository) private menuRepository: MenuRepositoryInterface,
    @inject(TYPES.CalculateDeliveryPriceUseCase)
    private calculateDeliveryPriceUseCase: CalculateDeliveryPriceUseCaseInterface,
    @inject(TYPES.AnalyticsRepository) private analyticsRepository: AnalyticsRepositoryInterface,
    @inject(TYPES.MailSender) private mailSender: MailSenderInterface,
    @inject(TYPES.Logger) private logger: LoggerInterface,
  ) {}

  async executeCreateOrder(data: CreateOrderDataInterface): Promise<OrderInterface> {
    const { items, userId, guestInfo } = data;

    // --- Validation (always before opening the transaction) ---
    if (!items || items.length === 0) {
      throw new AppError({
        code: AppErrorCodes.BAD_REQUEST_ORDER_EMPTY,
        message: 'An order must contain at least one item',
      });
    }

    if (!userId && !guestInfo?.guestEmail) {
      throw new AppError({
        code: AppErrorCodes.BAD_REQUEST_ORDER_MISSING_IDENTITY,
        message: 'A user id or guest information is required',
      });
    }

    // Load menus and apply the business rules.
    const orderItems: OrderItemInterface[] = [];
    const stockUpdates: StockUpdateInterface[] = [];
    const statLines: { menuId: string; menuName: string; quantity: number; unitPrice: number; lineRevenue: number }[] =
      [];
    let itemsTotal = 0;

    for (const item of items) {
      const menu = await this.menuRepository.findById(item.menuId);
      if (!menu) {
        throw new AppError({
          code: AppErrorCodes.NOT_FOUND_MENU,
          message: 'Menu not found',
          privateContext: { menuId: item.menuId },
        });
      }

      if (!menu.isAvailable) {
        throw new AppError({
          code: AppErrorCodes.BAD_REQUEST_ORDER_MENU_UNAVAILABLE,
          message: 'Menu is not available',
          privateContext: { menuId: item.menuId },
        });
      }

      if (item.quantity < menu.minPersons) {
        throw new AppError({
          code: AppErrorCodes.BAD_REQUEST_ORDER_BELOW_MIN_PERSONS,
          message: `Quantity ${item.quantity} is below the minimum of ${menu.minPersons} persons for this menu`,
          privateContext: { menuId: item.menuId, quantity: item.quantity, minPersons: menu.minPersons },
        });
      }

      if (menu.stock !== null && menu.stock !== undefined && item.quantity > menu.stock) {
        throw new AppError({
          code: AppErrorCodes.CONFLICT_ORDER_INSUFFICIENT_STOCK,
          message: 'Insufficient stock for this menu',
          privateContext: { menuId: item.menuId, quantity: item.quantity, stock: menu.stock },
        });
      }

      const { unitPrice, lineTotal, discountApplied } = computeLine(menu, item.quantity);
      itemsTotal = round2(itemsTotal + lineTotal);

      orderItems.push({
        id: '',
        orderId: '',
        menuId: menu.id,
        quantity: item.quantity,
        unitPrice,
        lineTotal,
        discountApplied,
        createdAt: new Date(),
      });

      statLines.push({
        menuId: menu.id,
        menuName: menu.name,
        quantity: item.quantity,
        unitPrice,
        lineRevenue: lineTotal,
      });

      if (menu.stock !== null && menu.stock !== undefined) {
        stockUpdates.push({ menuId: menu.id, newStock: menu.stock - item.quantity });
      }
    }

    // --- Delivery fee (reuses the Phase 4 pricing rule) ---
    const { zoneId, deliveryFee } = await this.calculateDeliveryPriceUseCase.executeCalculateDeliveryPrice({
      deliveryZoneId: data.deliveryZoneId ?? undefined,
      postalCode: data.deliveryPostalCode ?? undefined,
    });

    const totalPrice = round2(itemsTotal + deliveryFee);

    // --- Build the order aggregate ---
    const now = new Date();
    const order: OrderInterface = {
      id: '',
      userId: userId ?? null,
      status: OrderStatusEnum.PENDING,
      guestEmail: userId ? null : guestInfo?.guestEmail ?? null,
      guestName: userId ? null : guestInfo?.guestName ?? null,
      guestPhone: userId ? null : guestInfo?.guestPhone ?? null,
      deliveryAddress: data.deliveryAddress ?? null,
      deliveryCity: data.deliveryCity ?? null,
      deliveryPostalCode: data.deliveryPostalCode ?? null,
      deliveryZoneId: zoneId,
      deliveryDate: data.deliveryDate ?? null,
      deliveryFee,
      totalPrice,
      notes: data.notes ?? null,
      rejectionReason: null,
      rejectedBy: null,
      rejectedAt: null,
      materialReturnDeadline: null,
      materialPenaltyApplied: false,
      penaltyAmount: null,
      createdAt: now,
      updatedAt: now,
      orderItems,
    };

    const history: OrderHistoryInterface = {
      id: '',
      orderId: '',
      oldStatus: null,
      newStatus: OrderStatusEnum.PENDING,
      changedBy: userId ?? null,
      reason: null,
      contactMode: null,
      createdAt: now,
    };

    const payload: CreateOrderPayloadInterface = { order, items: orderItems, history, stockUpdates };
    const createdOrder = await this.orderRepository.createWithItemsAndStock(payload);

    // --- Write-through analytics (tolerant to failures inside the adapter) ---
    await this.analyticsRepository.recordOrderStats({
      orderId: createdOrder.id,
      orderStatus: OrderStatusEnum.PENDING,
      orderedAt: createdOrder.createdAt,
      completedAt: null,
      lines: statLines,
    });

    // --- Confirmation email (failure must not break the order) ---
    const recipientEmail = userId ? data.userEmail : guestInfo?.guestEmail;
    if (recipientEmail) {
      try {
        await this.mailSender.sendOrderConfirmationEmail({
          email: recipientEmail,
          orderId: createdOrder.id,
          customerName: guestInfo?.guestName ?? null,
          totalPrice: createdOrder.totalPrice,
          deliveryFee: createdOrder.deliveryFee,
          deliveryDate: createdOrder.deliveryDate,
        });
      } catch (error) {
        this.logger.error('Error sending order confirmation email', { error, orderId: createdOrder.id });
      }
    }

    return createdOrder;
  }
}
