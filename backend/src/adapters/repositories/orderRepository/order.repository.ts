import { inject, injectable } from 'inversify';
import { Repository, SelectQueryBuilder } from 'typeorm';

import { OrderInterface } from '@/domain/entities/order/order.entity.interface';
import {
  CreateOrderPayloadInterface,
  FindAllOrdersParamsInterface,
  FindOrdersByUserParamsInterface,
  OrderRepositoryInterface,
  UpdateStatusWithHistoryPayloadInterface,
} from '@/domain/interfaces/repositories/order.repository.interface';
import { ClientDatabaseInterface } from '@/infrastructure/database/clientDatabase/clientDatabase.interface';

import { TYPES } from '@/configuration/di/types';
import { OrderStatusEnum } from '@/domain/entities/order/orderStatus';
import { MenuSchema } from '@/infrastructure/database/schema/menu.schema';
import { OrderSchema } from '@/infrastructure/database/schema/order.schema';
import { OrderHistorySchema } from '@/infrastructure/database/schema/orderHistory.schema';
import { OrderItemSchema } from '@/infrastructure/database/schema/orderItem.schema';

@injectable()
export class OrderRepository implements OrderRepositoryInterface {
  private repository: Repository<OrderInterface>;
  constructor(@inject(TYPES.ClientDatabase) private clientDatabase: ClientDatabaseInterface) {
    this.repository = clientDatabase.getDataSource().getRepository(OrderSchema);
  }

  async createWithItemsAndStock(payload: CreateOrderPayloadInterface): Promise<OrderInterface> {
    const { order, items, history, stockUpdates } = payload;

    const createdId = await this.clientDatabase.getDataSource().transaction(async (manager) => {
      const orderRepository = manager.getRepository(OrderSchema);
      const orderItemRepository = manager.getRepository(OrderItemSchema);
      const orderHistoryRepository = manager.getRepository(OrderHistorySchema);
      const menuRepository = manager.getRepository(MenuSchema);

      // Insert the order (relations / empty id are dropped to let the db generate the uuid).
      const savedOrder = await orderRepository.save({
        ...(order.id ? { id: order.id } : {}),
        userId: order.userId,
        status: order.status,
        guestEmail: order.guestEmail,
        guestName: order.guestName,
        guestPhone: order.guestPhone,
        deliveryAddress: order.deliveryAddress,
        deliveryCity: order.deliveryCity,
        deliveryPostalCode: order.deliveryPostalCode,
        deliveryZoneId: order.deliveryZoneId,
        deliveryDate: order.deliveryDate,
        deliveryFee: order.deliveryFee,
        totalPrice: order.totalPrice,
        notes: order.notes,
        rejectionReason: order.rejectionReason,
        rejectedBy: order.rejectedBy,
        rejectedAt: order.rejectedAt,
        materialReturnDeadline: order.materialReturnDeadline,
      } as Partial<OrderInterface>);

      // Insert items with the generated order id.
      for (const item of items) {
        await orderItemRepository.save({
          ...(item.id ? { id: item.id } : {}),
          orderId: savedOrder.id,
          menuId: item.menuId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          lineTotal: item.lineTotal,
          discountApplied: item.discountApplied,
        });
      }

      // Initial history row.
      await orderHistoryRepository.save({
        ...(history.id ? { id: history.id } : {}),
        orderId: savedOrder.id,
        oldStatus: history.oldStatus,
        newStatus: history.newStatus,
        changedBy: history.changedBy,
        reason: history.reason,
        contactMode: history.contactMode,
      });

      // Decrement stock for the menus that track it.
      for (const stockUpdate of stockUpdates) {
        await menuRepository.update(stockUpdate.menuId, { stock: stockUpdate.newStock });
      }

      return savedOrder.id;
    });

    const created = await this.findById(createdId);
    // findById always resolves right after a successful commit.
    return created as OrderInterface;
  }

  async findById(id: string): Promise<OrderInterface | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['orderItems', 'orderItems.menu', 'history', 'user'],
      order: { history: { createdAt: 'ASC' } },
    });
  }

  private buildByUserQuery(
    userId: string,
    params?: FindOrdersByUserParamsInterface,
  ): SelectQueryBuilder<OrderInterface> {
    const { status } = params ?? {};
    const queryBuilder = this.repository.createQueryBuilder('order').where('order.user_id = :userId', { userId });

    if (status !== undefined) {
      queryBuilder.andWhere('order.status = :status', { status });
    }

    return queryBuilder;
  }

  async findAllByUser(userId: string, params?: FindOrdersByUserParamsInterface): Promise<OrderInterface[]> {
    const { limit, offset, sortBy, sortOrder } = params ?? {};

    const queryBuilder = this.buildByUserQuery(userId, params)
      .leftJoinAndSelect('order.orderItems', 'orderItem')
      .leftJoinAndSelect('orderItem.menu', 'menu');

    if (sortBy && sortOrder) {
      queryBuilder.orderBy(`order.${sortBy}`, sortOrder);
    } else {
      queryBuilder.orderBy('order.createdAt', 'DESC');
    }

    if (limit !== undefined) {
      queryBuilder.take(limit);
    }
    if (offset !== undefined) {
      queryBuilder.skip(offset);
    }

    return queryBuilder.getMany();
  }

  async countByUser(userId: string, params?: FindOrdersByUserParamsInterface): Promise<number> {
    return this.buildByUserQuery(userId, params).getCount();
  }

  private buildFindAllQuery(params?: FindAllOrdersParamsInterface): SelectQueryBuilder<OrderInterface> {
    const { status, search } = params ?? {};
    const queryBuilder = this.repository.createQueryBuilder('order');

    if (status !== undefined) {
      queryBuilder.andWhere('order.status = :status', { status });
    }

    if (search) {
      queryBuilder.andWhere(
        '(order.guest_name ILIKE :search OR order.guest_email ILIKE :search OR order.delivery_city ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    return queryBuilder;
  }

  async findAll(params?: FindAllOrdersParamsInterface): Promise<OrderInterface[]> {
    const { limit, offset, sortBy, sortOrder } = params ?? {};

    const queryBuilder = this.buildFindAllQuery(params)
      .leftJoinAndSelect('order.orderItems', 'orderItem')
      .leftJoinAndSelect('orderItem.menu', 'menu');

    if (sortBy && sortOrder) {
      queryBuilder.orderBy(`order.${sortBy}`, sortOrder);
    } else {
      queryBuilder.orderBy('order.createdAt', 'DESC');
    }

    if (limit !== undefined) {
      queryBuilder.take(limit);
    }
    if (offset !== undefined) {
      queryBuilder.skip(offset);
    }

    return queryBuilder.getMany();
  }

  async countFindAll(params?: FindAllOrdersParamsInterface): Promise<number> {
    return this.buildFindAllQuery(params).getCount();
  }

  async updateOne(id: string, data: Partial<OrderInterface>): Promise<void> {
    // Strip relations; only scalar columns are updatable here.
    const scalarData: Partial<OrderInterface> = { ...data };
    delete scalarData.orderItems;
    delete scalarData.user;
    delete scalarData.deliveryZone;
    delete scalarData.history;

    if (Object.keys(scalarData).length > 0) {
      await this.repository.update(id, scalarData);
    }
  }

  async updateStatusWithHistory(payload: UpdateStatusWithHistoryPayloadInterface): Promise<OrderInterface> {
    const { orderId, orderUpdate, history } = payload;

    await this.clientDatabase.getDataSource().transaction(async (manager) => {
      const orderRepository = manager.getRepository(OrderSchema);
      const orderHistoryRepository = manager.getRepository(OrderHistorySchema);

      // Strip relations; only scalar columns are updatable here.
      const scalarData: Partial<OrderInterface> = { ...orderUpdate };
      delete scalarData.orderItems;
      delete scalarData.user;
      delete scalarData.deliveryZone;
      delete scalarData.history;

      if (Object.keys(scalarData).length > 0) {
        await orderRepository.update(orderId, scalarData);
      }

      await orderHistoryRepository.save({
        ...(history.id ? { id: history.id } : {}),
        orderId,
        oldStatus: history.oldStatus,
        newStatus: history.newStatus,
        changedBy: history.changedBy,
        reason: history.reason,
        contactMode: history.contactMode,
      });
    });

    const updated = await this.findById(orderId);
    // findById always resolves right after a successful commit.
    return updated as OrderInterface;
  }

  async findOverdueMaterialReturns(now: Date): Promise<OrderInterface[]> {
    return this.repository
      .createQueryBuilder('order')
      .where('order.status = :status', { status: OrderStatusEnum.AWAITING_MATERIAL_RETURN })
      .andWhere('order.material_return_deadline IS NOT NULL')
      .andWhere('order.material_return_deadline < :now', { now })
      .andWhere('order.material_penalty_applied = false')
      .getMany();
  }
}
