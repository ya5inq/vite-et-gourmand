import { describe, beforeEach, vi, expect, it } from 'vitest';

import { getAllergenRepositoryMock } from '@/adapters/repositories/allergenRepository/allergen.repository.mock';
import { getDishRepositoryMock } from '@/adapters/repositories/dishRepository/dish.repository.mock';
import { AppError } from '@/application/errors/app.error';
import { allergenFactory } from '@/domain/entities/allergen/allergen.factory';
import { dishFactory } from '@/domain/entities/dish/dish.factory';

import { UpdateDishUseCase } from './updateDish.useCase';

describe('UpdateDishUseCase', () => {
  const dishRepositoryMock = getDishRepositoryMock();
  const allergenRepositoryMock = getAllergenRepositoryMock();
  const updateDishUseCase = new UpdateDishUseCase(dishRepositoryMock, allergenRepositoryMock);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should update scalar fields without touching allergens', async () => {
    const dish = dishFactory();
    const updated = { ...dish, name: 'Nouveau' };
    dishRepositoryMock.findById.mockResolvedValueOnce(dish).mockResolvedValueOnce(updated);

    const result = await updateDishUseCase.executeUpdateDish({ id: dish.id, data: { name: 'Nouveau' } });

    expect(allergenRepositoryMock.findByIds).not.toHaveBeenCalled();
    expect(dishRepositoryMock.updateOne).toHaveBeenCalledWith(dish.id, { name: 'Nouveau' });
    expect(result).toEqual(updated);
  });

  it('should resolve and replace allergens when allergenIds provided', async () => {
    const dish = dishFactory();
    const allergens = [allergenFactory()];
    allergenRepositoryMock.findByIds.mockResolvedValue(allergens);
    dishRepositoryMock.findById.mockResolvedValueOnce(dish).mockResolvedValueOnce(dish);

    await updateDishUseCase.executeUpdateDish({ id: dish.id, data: { allergenIds: allergens.map((a) => a.id) } });

    expect(allergenRepositoryMock.findByIds).toHaveBeenCalledWith(allergens.map((a) => a.id));
    expect(dishRepositoryMock.updateOne).toHaveBeenCalledWith(dish.id, { allergens });
  });

  it('should throw NOT_FOUND when dish does not exist', async () => {
    dishRepositoryMock.findById.mockResolvedValue(null);

    await expect(updateDishUseCase.executeUpdateDish({ id: 'missing', data: { name: 'X' } })).rejects.toThrow(AppError);
    expect(dishRepositoryMock.updateOne).not.toHaveBeenCalled();
  });
});
