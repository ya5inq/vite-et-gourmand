import { vi, Mocked } from 'vitest';

import { orderFactory } from '@/domain/entities/order/order.factory';

import { CreateOrderUseCaseInterface } from './createOrder.useCase.interface';

export const getCreateOrderUseCaseMock = (): Mocked<CreateOrderUseCaseInterface> => ({
  executeCreateOrder: vi.fn().mockResolvedValue(orderFactory()),
});
