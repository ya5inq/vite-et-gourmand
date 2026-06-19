import { describe, beforeEach, vi, expect, it } from 'vitest';

import { getDishRepositoryMock } from '@/adapters/repositories/dishRepository/dish.repository.mock';
import { AppError } from '@/application/errors/app.error';
import { dishFactory } from '@/domain/entities/dish/dish.factory';

import { GetDishUseCase } from './getDish.useCase';

describe('GetDishUseCase', () => {
  const dishRepositoryMock = getDishRepositoryMock();
  const getDishUseCase = new GetDishUseCase(dishRepositoryMock);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return a dish', async () => {
    const dish = dishFactory();
    dishRepositoryMock.findById.mockResolvedValue(dish);

    const result = await getDishUseCase.executeGetDish(dish.id);

    expect(result).toEqual(dish);
  });

  it('should throw NOT_FOUND when dish does not exist', async () => {
    dishRepositoryMock.findById.mockResolvedValue(null);

    await expect(getDishUseCase.executeGetDish('missing')).rejects.toThrow(AppError);
  });
});
