import { describe, beforeEach, vi, expect, it } from 'vitest';

import { getDishRepositoryMock } from '@/adapters/repositories/dishRepository/dish.repository.mock';
import { dishFactory } from '@/domain/entities/dish/dish.factory';

import { GetAllDishesUseCase } from './getAllDishes.useCase';

describe('GetAllDishesUseCase', () => {
  const dishRepositoryMock = getDishRepositoryMock();
  const getAllDishesUseCase = new GetAllDishesUseCase(dishRepositoryMock);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return dishes and totalCount', async () => {
    const dishes = [dishFactory(), dishFactory()];
    dishRepositoryMock.findAll.mockResolvedValue(dishes);
    dishRepositoryMock.countFindAll.mockResolvedValue(2);

    const result = await getAllDishesUseCase.executeGetAllDishes();

    expect(result.items).toEqual(dishes);
    expect(result.totalCount).toBe(2);
  });
});
