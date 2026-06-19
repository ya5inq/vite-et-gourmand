import { vi, Mocked } from 'vitest';

import { orderFactory } from '@/domain/entities/order/order.factory';

import { UpdateOrderStatusUseCaseInterface } from './updateOrderStatus.useCase.interface';

export const getUpdateOrderStatusUseCaseMock = (): Mocked<UpdateOrderStatusUseCaseInterface> => ({
  executeUpdateOrderStatus: vi.fn().mockResolvedValue(orderFactory()),
});
