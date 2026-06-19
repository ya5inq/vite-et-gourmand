import { vi, Mocked } from 'vitest';

import { dishFactory } from '@/domain/entities/dish/dish.factory';

import { GetDishUseCaseInterface } from './getDish.useCase.interface';

export const getGetDishUseCaseMock = (): Mocked<GetDishUseCaseInterface> => ({
  executeGetDish: vi.fn().mockResolvedValue(dishFactory()),
});
