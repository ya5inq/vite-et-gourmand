import { vi, Mocked } from 'vitest';

import { dishFactory } from '@/domain/entities/dish/dish.factory';

import { CreateDishUseCaseInterface } from './createDish.useCase.interface';

export const getCreateDishUseCaseMock = (): Mocked<CreateDishUseCaseInterface> => ({
  executeCreateDish: vi.fn().mockResolvedValue(dishFactory()),
});
