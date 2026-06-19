import { describe, beforeEach, vi, expect, it } from 'vitest';

import { DishCategory } from '@/domain/entities/dish/dish.entity.interface';

import { getAllergenRepositoryMock } from '@/adapters/repositories/allergenRepository/allergen.repository.mock';
import { getDishRepositoryMock } from '@/adapters/repositories/dishRepository/dish.repository.mock';
import { allergenFactory } from '@/domain/entities/allergen/allergen.factory';
import { dishFactory } from '@/domain/entities/dish/dish.factory';

import { CreateDishUseCase } from './createDish.useCase';

describe('CreateDishUseCase', () => {
  const dishRepositoryMock = getDishRepositoryMock();
  const allergenRepositoryMock = getAllergenRepositoryMock();
  const createDishUseCase = new CreateDishUseCase(dishRepositoryMock, allergenRepositoryMock);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create a dish with resolved allergens', async () => {
    const allergens = [allergenFactory(), allergenFactory()];
    allergenRepositoryMock.findByIds.mockResolvedValue(allergens);
    const dish = dishFactory({ name: 'Tartare', allergens });
    dishRepositoryMock.create.mockResolvedValue(dish);

    const result = await createDishUseCase.executeCreateDish({
      name: 'Tartare',
      category: DishCategory.ENTREE,
      price: 14.5,
      allergenIds: allergens.map((a) => a.id),
    });

    expect(allergenRepositoryMock.findByIds).toHaveBeenCalledWith(allergens.map((a) => a.id));
    const created = dishRepositoryMock.create.mock.calls[0][0];
    expect(created.allergens).toEqual(allergens);
    expect(result).toEqual(dish);
  });

  it('should create a dish with no allergens when allergenIds omitted', async () => {
    dishRepositoryMock.create.mockImplementation((d) => Promise.resolve(d));

    await createDishUseCase.executeCreateDish({ name: 'Soupe', category: DishCategory.ENTREE });

    expect(allergenRepositoryMock.findByIds).not.toHaveBeenCalled();
    const created = dishRepositoryMock.create.mock.calls[0][0];
    expect(created.allergens).toEqual([]);
  });
});
