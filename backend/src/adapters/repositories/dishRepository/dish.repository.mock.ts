import { vi, Mocked } from 'vitest';

import { DishInterface } from '@/domain/entities/dish/dish.entity.interface';
import { DishRepositoryInterface } from '@/domain/interfaces/repositories/dish.repository.interface';

import { dishFactory } from '@/domain/entities/dish/dish.factory';

export const getDishRepositoryMock = (options?: {
  findById?: DishInterface | null;
  findByIds?: DishInterface[];
  findAll?: DishInterface[];
  countFindAll?: number;
}): Mocked<DishRepositoryInterface> => ({
  findById: vi.fn().mockResolvedValue(options?.findById ?? null),
  findByIds: vi.fn().mockResolvedValue(options?.findByIds ?? []),
  findAll: vi.fn().mockResolvedValue(options?.findAll ?? []),
  countFindAll: vi.fn().mockResolvedValue(options?.countFindAll ?? 0),
  create: vi.fn().mockImplementation((dish: DishInterface) => Promise.resolve(dish ?? dishFactory())),
  updateOne: vi.fn().mockResolvedValue(undefined),
  deleteOne: vi.fn().mockResolvedValue(undefined),
});
