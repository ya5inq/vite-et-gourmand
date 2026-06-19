import { beforeEach, describe, expect, it, vi } from 'vitest';

import { getAuditLogRepositoryMock } from '@/adapters/auditLog/auditLog.repository.mock';
import { getLoggerMock } from '@/adapters/logger/logger.mock';
import { getMailSenderMock } from '@/adapters/mailSender/mailSender.mock';
import { getOrderRepositoryMock } from '@/adapters/repositories/orderRepository/order.repository.mock';
import { orderFactory } from '@/domain/entities/order/order.factory';
import { OrderStatusEnum } from '@/domain/entities/order/orderStatus';

import { ApplyMaterialReturnPenaltiesUseCase } from './applyMaterialReturnPenalties.useCase';

describe('ApplyMaterialReturnPenaltiesUseCase', () => {
  const orderRepositoryMock = getOrderRepositoryMock();
  const auditLogRepositoryMock = getAuditLogRepositoryMock();
  const mailSenderMock = getMailSenderMock();
  const loggerMock = getLoggerMock();

  const useCase = new ApplyMaterialReturnPenaltiesUseCase(
    orderRepositoryMock,
    auditLogRepositoryMock,
    mailSenderMock,
    loggerMock,
  );

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const overdueOrder = () =>
    orderFactory({
      id: 'overdue-1',
      status: OrderStatusEnum.AWAITING_MATERIAL_RETURN,
      totalPrice: 1000,
      penaltyAmount: null,
      materialPenaltyApplied: false,
      guestEmail: 'guest@test.fr',
      guestName: 'Jean',
      materialReturnDeadline: new Date(Date.now() - 1000 * 60 * 60 * 24),
    });

  it('applies a 600€ penalty to each overdue order', async () => {
    orderRepositoryMock.findOverdueMaterialReturns.mockResolvedValueOnce([overdueOrder()]);

    const result = await useCase.executeApplyMaterialReturnPenalties();

    expect(result.penalizedCount).toBe(1);
    const payload = orderRepositoryMock.updateStatusWithHistory.mock.calls[0][0];
    expect(payload.orderUpdate.penaltyAmount).toBe(600);
    expect(payload.orderUpdate.totalPrice).toBe(1600);
    expect(payload.orderUpdate.materialPenaltyApplied).toBe(true);
    expect(payload.history.reason).toContain('600');
  });

  it('records an audit log and sends a penalty email', async () => {
    orderRepositoryMock.findOverdueMaterialReturns.mockResolvedValueOnce([overdueOrder()]);

    await useCase.executeApplyMaterialReturnPenalties();

    expect(auditLogRepositoryMock.record).toHaveBeenCalledTimes(1);
    expect(auditLogRepositoryMock.record.mock.calls[0][0].action).toBe('MATERIAL_PENALTY_APPLIED');
    expect(mailSenderMock.sendMaterialPenaltyEmail).toHaveBeenCalledTimes(1);
    expect(mailSenderMock.sendMaterialPenaltyEmail.mock.calls[0][0].penaltyAmount).toBe(600);
  });

  it('is idempotent: no overdue orders means no penalty applied', async () => {
    // The repository query already filters out orders with materialPenaltyApplied = true.
    orderRepositoryMock.findOverdueMaterialReturns.mockResolvedValueOnce([]);

    const result = await useCase.executeApplyMaterialReturnPenalties();

    expect(result.penalizedCount).toBe(0);
    expect(orderRepositoryMock.updateStatusWithHistory).not.toHaveBeenCalled();
    expect(mailSenderMock.sendMaterialPenaltyEmail).not.toHaveBeenCalled();
  });

  it('does not throw when the penalty email fails', async () => {
    orderRepositoryMock.findOverdueMaterialReturns.mockResolvedValueOnce([overdueOrder()]);
    mailSenderMock.sendMaterialPenaltyEmail.mockRejectedValueOnce(new Error('smtp down'));

    await expect(useCase.executeApplyMaterialReturnPenalties()).resolves.toMatchObject({ penalizedCount: 1 });
    expect(loggerMock.error).toHaveBeenCalled();
  });
});
