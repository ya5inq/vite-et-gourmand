import { describe, beforeEach, vi, expect, it } from 'vitest';

import { getOrderRepositoryMock } from '@/adapters/repositories/orderRepository/order.repository.mock';
import { orderFactory } from '@/domain/entities/order/order.factory';

import { GetOrderUseCase } from './getOrder.useCase';

describe('GetOrderUseCase', () => {
  const orderRepositoryMock = getOrderRepositoryMock();
  const useCase = new GetOrderUseCase(orderRepositoryMock);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns the order to its owner', async () => {
    const order = orderFactory({ userId: 'user-1' });
    orderRepositoryMock.findById.mockResolvedValue(order);

    const result = await useCase.executeGetOrder({ orderId: order.id, requesterId: 'user-1' });
    expect(result).toEqual(order);
  });

  it('throws NOT_FOUND_ORDER when the order does not exist', async () => {
    orderRepositoryMock.findById.mockResolvedValue(null);

    await expect(useCase.executeGetOrder({ orderId: 'missing', requesterId: 'user-1' })).rejects.toMatchObject({
      code: 'NOT_FOUND_ORDER',
    });
  });

  it('throws FORBIDDEN_ORDER_NOT_OWNER when a non-owner non-staff requests it', async () => {
    orderRepositoryMock.findById.mockResolvedValue(orderFactory({ userId: 'user-1' }));

    await expect(useCase.executeGetOrder({ orderId: 'order-1', requesterId: 'user-2' })).rejects.toMatchObject({
      code: 'FORBIDDEN_ORDER_NOT_OWNER',
    });
  });

  it('lets staff read any order', async () => {
    const order = orderFactory({ userId: 'user-1' });
    orderRepositoryMock.findById.mockResolvedValue(order);

    const result = await useCase.executeGetOrder({ orderId: order.id, requesterId: 'staff-1', isStaff: true });
    expect(result).toEqual(order);
  });
});
