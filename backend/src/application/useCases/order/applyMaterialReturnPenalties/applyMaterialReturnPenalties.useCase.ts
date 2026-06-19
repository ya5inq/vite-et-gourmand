import { inject, injectable } from 'inversify';

import { OrderInterface } from '@/domain/entities/order/order.entity.interface';
import { OrderHistoryInterface } from '@/domain/entities/orderHistory/orderHistory.entity.interface';
import { AuditLogRepositoryInterface } from '@/domain/interfaces/adapters/auditLog.repository.interface';
import { MailSenderInterface } from '@/domain/interfaces/adapters/mailSender.interface';
import { LoggerInterface } from '@/domain/interfaces/logger/logger.interface';
import { OrderRepositoryInterface } from '@/domain/interfaces/repositories/order.repository.interface';

import { round2 } from '@/application/useCases/order/createOrder/createOrder.useCase';
import { TYPES } from '@/configuration/di/types';
import { MATERIAL_RETURN_PENALTY_AMOUNT } from '@/domain/entities/order/orderContactMode';

import {
  ApplyMaterialReturnPenaltiesResultInterface,
  ApplyMaterialReturnPenaltiesUseCaseInterface,
} from './applyMaterialReturnPenalties.useCase.interface';

const PENALTY_HISTORY_NOTE = `Pénalité matériel ${MATERIAL_RETURN_PENALTY_AMOUNT}€ appliquée`;

@injectable()
export class ApplyMaterialReturnPenaltiesUseCase implements ApplyMaterialReturnPenaltiesUseCaseInterface {
  constructor(
    @inject(TYPES.OrderRepository) private orderRepository: OrderRepositoryInterface,
    @inject(TYPES.AuditLogRepository) private auditLogRepository: AuditLogRepositoryInterface,
    @inject(TYPES.MailSender) private mailSender: MailSenderInterface,
    @inject(TYPES.Logger) private logger: LoggerInterface,
  ) {}

  async executeApplyMaterialReturnPenalties(): Promise<ApplyMaterialReturnPenaltiesResultInterface> {
    const now = new Date();
    const overdueOrders = await this.orderRepository.findOverdueMaterialReturns(now);

    let penalizedCount = 0;
    for (const order of overdueOrders) {
      await this.applyPenalty(order, now);
      penalizedCount += 1;
    }

    if (penalizedCount > 0) {
      this.logger.info('Material-return penalties applied', { penalizedCount });
    }

    return { penalizedCount };
  }

  private async applyPenalty(order: OrderInterface, now: Date): Promise<void> {
    const orderUpdate: Partial<OrderInterface> = {
      penaltyAmount: MATERIAL_RETURN_PENALTY_AMOUNT,
      totalPrice: round2(order.totalPrice + MATERIAL_RETURN_PENALTY_AMOUNT),
      materialPenaltyApplied: true,
      updatedAt: now,
    };

    const history: OrderHistoryInterface = {
      id: '',
      orderId: order.id,
      oldStatus: order.status,
      newStatus: order.status,
      changedBy: null,
      reason: PENALTY_HISTORY_NOTE,
      contactMode: null,
      createdAt: now,
    };

    await this.orderRepository.updateStatusWithHistory({ orderId: order.id, orderUpdate, history });

    await this.auditLogRepository.record({
      entityType: 'order',
      entityId: order.id,
      action: 'MATERIAL_PENALTY_APPLIED',
      actorId: null,
      actorRole: null,
      before: { penaltyAmount: order.penaltyAmount, totalPrice: order.totalPrice },
      after: { penaltyAmount: MATERIAL_RETURN_PENALTY_AMOUNT, totalPrice: orderUpdate.totalPrice },
      metadata: { penaltyAmount: MATERIAL_RETURN_PENALTY_AMOUNT },
    });

    const recipientEmail = order.user?.email ?? order.guestEmail ?? null;
    if (recipientEmail) {
      try {
        await this.mailSender.sendMaterialPenaltyEmail({
          email: recipientEmail,
          orderId: order.id,
          customerName: order.guestName ?? null,
          penaltyAmount: MATERIAL_RETURN_PENALTY_AMOUNT,
        });
      } catch (error) {
        this.logger.error('Error sending material penalty email', { error, orderId: order.id });
      }
    }
  }
}
