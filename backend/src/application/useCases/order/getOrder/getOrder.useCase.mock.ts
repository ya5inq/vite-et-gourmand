import { vi, Mocked } from 'vitest';

import { orderFactory } from '@/domain/entities/order/order.factory';

import { GetOrderUseCaseInterface } from './getOrder.useCase.interface';

export const getGetOrderUseCaseMock = (): Mocked<GetOrderUseCaseInterface> => ({
  executeGetOrder: vi.fn().mockResolvedValue(orderFactory()),
});
