import { describe, beforeEach, vi, expect, it } from 'vitest';

import { getOrderRepositoryMock } from '@/adapters/repositories/orderRepository/order.repository.mock';
import { orderFactory } from '@/domain/entities/order/order.factory';

import { GetUserOrdersUseCase } from './getUserOrders.useCase';

describe('GetUserOrdersUseCase', () => {
  const orderRepositoryMock = getOrderRepositoryMock();
  const useCase = new GetUserOrdersUseCase(orderRepositoryMock);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns the user orders scoped to the userId and the count', async () => {
    const orders = [orderFactory(), orderFactory()];
    orderRepositoryMock.findAllByUser.mockResolvedValue(orders);
    orderRepositoryMock.countByUser.mockResolvedValue(2);

    const result = await useCase.executeGetUserOrders({ userId: 'user-1', limit: 10, offset: 0 });

    expect(orderRepositoryMock.findAllByUser).toHaveBeenCalledWith('user-1', { limit: 10, offset: 0 });
    expect(orderRepositoryMock.countByUser).toHaveBeenCalledWith('user-1', { limit: 10, offset: 0 });
    expect(result).toEqual({ items: orders, totalCount: 2 });
  });
});
