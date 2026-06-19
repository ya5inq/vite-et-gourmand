import { beforeEach, describe, expect, it, vi } from 'vitest';

import { RoleType } from '@/domain/entities/user/user.entity.interface';

import { getAnalyticsRepositoryMock } from '@/adapters/analytics/analytics.repository.mock';
import { getAuditLogRepositoryMock } from '@/adapters/auditLog/auditLog.repository.mock';
import { getLoggerMock } from '@/adapters/logger/logger.mock';
import { getMailSenderMock } from '@/adapters/mailSender/mailSender.mock';
import { getOrderRepositoryMock } from '@/adapters/repositories/orderRepository/order.repository.mock';
import { orderFactory } from '@/domain/entities/order/order.factory';
import { OrderContactModeEnum } from '@/domain/entities/order/orderContactMode';
import { OrderStatusEnum } from '@/domain/entities/order/orderStatus';
import { isWeekend } from '@/domain/utils/businessDays';

import { UpdateOrderStatusUseCase } from './updateOrderStatus.useCase';

describe('UpdateOrderStatusUseCase', () => {
  const orderRepositoryMock = getOrderRepositoryMock();
  const analyticsRepositoryMock = getAnalyticsRepositoryMock();
  const auditLogRepositoryMock = getAuditLogRepositoryMock();
  const mailSenderMock = getMailSenderMock();
  const loggerMock = getLoggerMock();

  const useCase = new UpdateOrderStatusUseCase(
    orderRepositoryMock,
    analyticsRepositoryMock,
    auditLogRepositoryMock,
    mailSenderMock,
    loggerMock,
  );

  const actor = { actorId: 'staff-1', actorRole: RoleType.EMPLOYEE };

  beforeEach(() => {
    vi.clearAllMocks();
    // Default: updateStatusWithHistory echoes back the updated order.
    orderRepositoryMock.updateStatusWithHistory.mockImplementation(({ orderId, orderUpdate }) =>
      Promise.resolve(orderFactory({ id: orderId, guestEmail: 'guest@test.fr', guestName: 'Jean', ...orderUpdate })),
    );
  });

  it('throws NOT_FOUND_ORDER when the order does not exist', async () => {
    orderRepositoryMock.findById.mockResolvedValueOnce(null);

    await expect(
      useCase.executeUpdateOrderStatus({ orderId: 'missing', newStatus: OrderStatusEnum.ACCEPTED, ...actor }),
    ).rejects.toMatchObject({ code: 'NOT_FOUND_ORDER' });
  });

  it('accepts a valid transition (PENDING -> ACCEPTED) and writes history', async () => {
    orderRepositoryMock.findById.mockResolvedValueOnce(orderFactory({ id: 'o1', status: OrderStatusEnum.PENDING }));

    await useCase.executeUpdateOrderStatus({ orderId: 'o1', newStatus: OrderStatusEnum.ACCEPTED, ...actor });

    const payload = orderRepositoryMock.updateStatusWithHistory.mock.calls[0][0];
    expect(payload.orderUpdate.status).toBe(OrderStatusEnum.ACCEPTED);
    expect(payload.history.oldStatus).toBe(OrderStatusEnum.PENDING);
    expect(payload.history.newStatus).toBe(OrderStatusEnum.ACCEPTED);
    expect(payload.history.changedBy).toBe('staff-1');
  });

  it('rejects an invalid transition (PENDING -> COMPLETED)', async () => {
    orderRepositoryMock.findById.mockResolvedValueOnce(orderFactory({ id: 'o1', status: OrderStatusEnum.PENDING }));

    await expect(
      useCase.executeUpdateOrderStatus({ orderId: 'o1', newStatus: OrderStatusEnum.COMPLETED, ...actor }),
    ).rejects.toMatchObject({ code: 'BAD_REQUEST_INVALID_ORDER_TRANSITION' });

    expect(orderRepositoryMock.updateStatusWithHistory).not.toHaveBeenCalled();
  });

  it('rejects CANCELLED without reason / contactMode', async () => {
    orderRepositoryMock.findById.mockResolvedValueOnce(orderFactory({ id: 'o1', status: OrderStatusEnum.PENDING }));

    await expect(
      useCase.executeUpdateOrderStatus({ orderId: 'o1', newStatus: OrderStatusEnum.CANCELLED, ...actor }),
    ).rejects.toMatchObject({ code: 'BAD_REQUEST_ORDER_CONTACT_REQUIRED' });
  });

  it('rejects REJECTED with reason but no contactMode', async () => {
    orderRepositoryMock.findById.mockResolvedValueOnce(orderFactory({ id: 'o1', status: OrderStatusEnum.PENDING }));

    await expect(
      useCase.executeUpdateOrderStatus({
        orderId: 'o1',
        newStatus: OrderStatusEnum.REJECTED,
        reason: 'Plus de stock',
        ...actor,
      }),
    ).rejects.toMatchObject({ code: 'BAD_REQUEST_ORDER_CONTACT_REQUIRED' });
  });

  it('accepts REJECTED with reason + contactMode and stores rejection fields', async () => {
    orderRepositoryMock.findById.mockResolvedValueOnce(orderFactory({ id: 'o1', status: OrderStatusEnum.PENDING }));

    await useCase.executeUpdateOrderStatus({
      orderId: 'o1',
      newStatus: OrderStatusEnum.REJECTED,
      reason: 'Plus de stock',
      contactMode: OrderContactModeEnum.PHONE,
      ...actor,
    });

    const payload = orderRepositoryMock.updateStatusWithHistory.mock.calls[0][0];
    expect(payload.orderUpdate.rejectionReason).toBe('Plus de stock');
    expect(payload.orderUpdate.rejectedBy).toBe('staff-1');
    expect(payload.orderUpdate.rejectedAt).toBeInstanceOf(Date);
    expect(payload.history.contactMode).toBe(OrderContactModeEnum.PHONE);
  });

  it('sets a +10 business-day deadline and sends the material email on AWAITING_MATERIAL_RETURN', async () => {
    orderRepositoryMock.findById.mockResolvedValueOnce(
      orderFactory({ id: 'o1', status: OrderStatusEnum.DELIVERED, guestEmail: 'guest@test.fr', guestName: 'Jean' }),
    );

    await useCase.executeUpdateOrderStatus({
      orderId: 'o1',
      newStatus: OrderStatusEnum.AWAITING_MATERIAL_RETURN,
      ...actor,
    });

    const payload = orderRepositoryMock.updateStatusWithHistory.mock.calls[0][0];
    const deadline = payload.orderUpdate.materialReturnDeadline as Date;
    expect(deadline).toBeInstanceOf(Date);
    expect(isWeekend(deadline)).toBe(false);
    // At least 10 calendar days ahead (10 business days >= 10 calendar days).
    const diffDays = Math.round((deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    expect(diffDays).toBeGreaterThanOrEqual(10);

    expect(mailSenderMock.sendMaterialReturnEmail).toHaveBeenCalledTimes(1);
    const mailArg = mailSenderMock.sendMaterialReturnEmail.mock.calls[0][0];
    expect(mailArg.penaltyAmount).toBe(600);
  });

  it('sends the review-invitation email on COMPLETED and updates analytics with completedAt', async () => {
    orderRepositoryMock.findById.mockResolvedValueOnce(
      orderFactory({ id: 'o1', status: OrderStatusEnum.DELIVERED, guestEmail: 'guest@test.fr' }),
    );

    await useCase.executeUpdateOrderStatus({ orderId: 'o1', newStatus: OrderStatusEnum.COMPLETED, ...actor });

    expect(mailSenderMock.sendOrderCompletedEmail).toHaveBeenCalledTimes(1);
    const [orderId, status, completedAt] = analyticsRepositoryMock.updateOrderStatus.mock.calls[0];
    expect(orderId).toBe('o1');
    expect(status).toBe(OrderStatusEnum.COMPLETED);
    expect(completedAt).toBeInstanceOf(Date);
  });

  it('records an audit log entry on every transition', async () => {
    orderRepositoryMock.findById.mockResolvedValueOnce(orderFactory({ id: 'o1', status: OrderStatusEnum.ACCEPTED }));

    await useCase.executeUpdateOrderStatus({ orderId: 'o1', newStatus: OrderStatusEnum.PREPARING, ...actor });

    expect(auditLogRepositoryMock.record).toHaveBeenCalledTimes(1);
    const auditArg = auditLogRepositoryMock.record.mock.calls[0][0];
    expect(auditArg).toMatchObject({
      entityType: 'order',
      entityId: 'o1',
      action: 'STATUS_CHANGED',
      actorId: 'staff-1',
      before: { status: OrderStatusEnum.ACCEPTED },
      after: { status: OrderStatusEnum.PREPARING },
    });
  });

  it('does not throw when a notification email fails', async () => {
    orderRepositoryMock.findById.mockResolvedValueOnce(
      orderFactory({ id: 'o1', status: OrderStatusEnum.DELIVERED, guestEmail: 'guest@test.fr' }),
    );
    mailSenderMock.sendOrderCompletedEmail.mockRejectedValueOnce(new Error('smtp down'));

    await expect(
      useCase.executeUpdateOrderStatus({ orderId: 'o1', newStatus: OrderStatusEnum.COMPLETED, ...actor }),
    ).resolves.toBeDefined();

    expect(loggerMock.error).toHaveBeenCalled();
  });
});
