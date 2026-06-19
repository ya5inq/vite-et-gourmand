import { vi, Mocked } from 'vitest';

import { OrderInterface } from '@/domain/entities/order/order.entity.interface';
import {
  CreateOrderPayloadInterface,
  OrderRepositoryInterface,
} from '@/domain/interfaces/repositories/order.repository.interface';

export const getOrderRepositoryMock = (options?: {
  createWithItemsAndStock?: OrderInterface;
  findById?: OrderInterface | null;
  findAllByUser?: OrderInterface[];
  countByUser?: number;
  findAll?: OrderInterface[];
  countFindAll?: number;
  updateStatusWithHistory?: OrderInterface;
  findOverdueMaterialReturns?: OrderInterface[];
}): Mocked<OrderRepositoryInterface> => ({
  createWithItemsAndStock: vi
    .fn()
    .mockImplementation((payload: CreateOrderPayloadInterface) =>
      Promise.resolve(options?.createWithItemsAndStock ?? { ...payload.order, orderItems: payload.items }),
    ),
  findById: vi.fn().mockResolvedValue(options?.findById ?? null),
  findAllByUser: vi.fn().mockResolvedValue(options?.findAllByUser ?? []),
  countByUser: vi.fn().mockResolvedValue(options?.countByUser ?? 0),
  findAll: vi.fn().mockResolvedValue(options?.findAll ?? []),
  countFindAll: vi.fn().mockResolvedValue(options?.countFindAll ?? 0),
  updateOne: vi.fn().mockResolvedValue(undefined),
  updateStatusWithHistory: vi.fn().mockResolvedValue(options?.updateStatusWithHistory ?? null),
  findOverdueMaterialReturns: vi.fn().mockResolvedValue(options?.findOverdueMaterialReturns ?? []),
});
