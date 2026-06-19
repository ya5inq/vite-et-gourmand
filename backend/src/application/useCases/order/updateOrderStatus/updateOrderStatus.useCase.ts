import { inject, injectable } from 'inversify';

import { AppErrorCodes } from '@/application/errors/app.error.interface';
import { OrderInterface } from '@/domain/entities/order/order.entity.interface';
import { OrderHistoryInterface } from '@/domain/entities/orderHistory/orderHistory.entity.interface';
import { AnalyticsRepositoryInterface } from '@/domain/interfaces/adapters/analytics.repository.interface';
import { AuditLogRepositoryInterface } from '@/domain/interfaces/adapters/auditLog.repository.interface';
import { MailSenderInterface } from '@/domain/interfaces/adapters/mailSender.interface';
import { LoggerInterface } from '@/domain/interfaces/logger/logger.interface';
import { OrderRepositoryInterface } from '@/domain/interfaces/repositories/order.repository.interface';

import { AppError } from '@/application/errors/app.error';
import { TYPES } from '@/configuration/di/types';
import {
  MATERIAL_RETURN_BUSINESS_DAYS,
  MATERIAL_RETURN_PENALTY_AMOUNT,
} from '@/domain/entities/order/orderContactMode';
import { OrderStatusEnum, ORDER_STATUS_TRANSITIONS } from '@/domain/entities/order/orderStatus';
import { addBusinessDays } from '@/domain/utils/businessDays';

import {
  UpdateOrderStatusParamsInterface,
  UpdateOrderStatusUseCaseInterface,
} from './updateOrderStatus.useCase.interface';

/** Statuses that require a contact mode + reason when a staff member sets them. */
const CONTACT_REQUIRED_STATUSES = [OrderStatusEnum.CANCELLED, OrderStatusEnum.REJECTED];

@injectable()
export class UpdateOrderStatusUseCase implements UpdateOrderStatusUseCaseInterface {
  constructor(
    @inject(TYPES.OrderRepository) private orderRepository: OrderRepositoryInterface,
    @inject(TYPES.AnalyticsRepository) private analyticsRepository: AnalyticsRepositoryInterface,
    @inject(TYPES.AuditLogRepository) private auditLogRepository: AuditLogRepositoryInterface,
    @inject(TYPES.MailSender) private mailSender: MailSenderInterface,
    @inject(TYPES.Logger) private logger: LoggerInterface,
  ) {}

  async executeUpdateOrderStatus(params: UpdateOrderStatusParamsInterface): Promise<OrderInterface> {
    const { orderId, newStatus, actorId, actorRole, reason, contactMode } = params;

    const order = await this.orderRepository.findById(orderId);
    if (!order) {
      throw new AppError({
        code: AppErrorCodes.NOT_FOUND_ORDER,
        message: 'Order not found',
        privateContext: { orderId },
      });
    }

    const oldStatus = order.status;

    // --- Guard: transition allowed by the state machine ---
    const allowed = ORDER_STATUS_TRANSITIONS[oldStatus] ?? [];
    if (!allowed.includes(newStatus)) {
      throw new AppError({
        code: AppErrorCodes.BAD_REQUEST_INVALID_ORDER_TRANSITION,
        message: `Invalid order transition from ${oldStatus} to ${newStatus}`,
        privateContext: { orderId, from: oldStatus, to: newStatus },
      });
    }

    // --- Guard: cancellation / rejection require a contact mode + reason ---
    if (CONTACT_REQUIRED_STATUSES.includes(newStatus) && (!reason || !contactMode)) {
      throw new AppError({
        code: AppErrorCodes.BAD_REQUEST_ORDER_CONTACT_REQUIRED,
        message: 'A reason and a contact mode are required to cancel or reject an order',
        privateContext: { orderId, newStatus },
      });
    }

    const now = new Date();
    const orderUpdate: Partial<OrderInterface> = { status: newStatus, updatedAt: now };

    if (newStatus === OrderStatusEnum.REJECTED) {
      orderUpdate.rejectionReason = reason ?? null;
      orderUpdate.rejectedBy = actorId;
      orderUpdate.rejectedAt = now;
    }

    let materialReturnDeadline: Date | null = null;
    if (newStatus === OrderStatusEnum.AWAITING_MATERIAL_RETURN) {
      materialReturnDeadline = addBusinessDays(now, MATERIAL_RETURN_BUSINESS_DAYS);
      orderUpdate.materialReturnDeadline = materialReturnDeadline;
    }

    const history: OrderHistoryInterface = {
      id: '',
      orderId,
      oldStatus,
      newStatus,
      changedBy: actorId,
      reason: reason ?? null,
      contactMode: contactMode ?? null,
      createdAt: now,
    };

    const updatedOrder = await this.orderRepository.updateStatusWithHistory({ orderId, orderUpdate, history });

    // --- Write-through analytics (fault-tolerant inside the adapter) ---
    await this.analyticsRepository.updateOrderStatus(
      orderId,
      newStatus,
      newStatus === OrderStatusEnum.COMPLETED ? now : null,
    );

    // --- Audit log (fault-tolerant inside the adapter) ---
    await this.auditLogRepository.record({
      entityType: 'order',
      entityId: orderId,
      action: 'STATUS_CHANGED',
      actorId,
      actorRole,
      before: { status: oldStatus },
      after: { status: newStatus },
      metadata: { reason: reason ?? null, contactMode: contactMode ?? null },
    });

    // --- Notifications (a failure must not roll back the transition) ---
    const recipientEmail = this.resolveRecipientEmail(updatedOrder);
    const customerName = updatedOrder.guestName ?? null;

    if (recipientEmail && newStatus === OrderStatusEnum.AWAITING_MATERIAL_RETURN && materialReturnDeadline) {
      try {
        await this.mailSender.sendMaterialReturnEmail({
          email: recipientEmail,
          orderId,
          customerName,
          deadline: materialReturnDeadline,
          penaltyAmount: MATERIAL_RETURN_PENALTY_AMOUNT,
        });
      } catch (error) {
        this.logger.error('Error sending material return email', { error, orderId });
      }
    }

    if (recipientEmail && newStatus === OrderStatusEnum.COMPLETED) {
      try {
        await this.mailSender.sendOrderCompletedEmail({ email: recipientEmail, orderId, customerName });
      } catch (error) {
        this.logger.error('Error sending order completed email', { error, orderId });
      }
    }

    return updatedOrder;
  }

  private resolveRecipientEmail(order: OrderInterface): string | null {
    return order.user?.email ?? order.guestEmail ?? null;
  }
}
