import { vi, Mocked } from 'vitest';

import { dishFactory } from '@/domain/entities/dish/dish.factory';

import { UpdateDishUseCaseInterface } from './updateDish.useCase.interface';

export const getUpdateDishUseCaseMock = (): Mocked<UpdateDishUseCaseInterface> => ({
  executeUpdateDish: vi.fn().mockResolvedValue(dishFactory()),
});
