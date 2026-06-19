import { describe, beforeEach, vi, expect, it } from 'vitest';

import { getDishRepositoryMock } from '@/adapters/repositories/dishRepository/dish.repository.mock';
import { AppError } from '@/application/errors/app.error';
import { dishFactory } from '@/domain/entities/dish/dish.factory';

import { DeleteDishUseCase } from './deleteDish.useCase';

describe('DeleteDishUseCase', () => {
  const dishRepositoryMock = getDishRepositoryMock();
  const deleteDishUseCase = new DeleteDishUseCase(dishRepositoryMock);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should delete a dish', async () => {
    const dish = dishFactory();
    dishRepositoryMock.findById.mockResolvedValue(dish);

    await deleteDishUseCase.executeDeleteDish(dish.id);

    expect(dishRepositoryMock.deleteOne).toHaveBeenCalledWith(dish.id);
  });

  it('should throw NOT_FOUND when dish does not exist', async () => {
    dishRepositoryMock.findById.mockResolvedValue(null);

    await expect(deleteDishUseCase.executeDeleteDish('missing')).rejects.toThrow(AppError);
    expect(dishRepositoryMock.deleteOne).not.toHaveBeenCalled();
  });
});
