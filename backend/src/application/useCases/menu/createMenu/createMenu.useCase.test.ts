import { describe, beforeEach, vi, expect, it } from 'vitest';

import { getDietaryRegimeRepositoryMock } from '@/adapters/repositories/dietaryRegimeRepository/dietaryRegime.repository.mock';
import { getDishRepositoryMock } from '@/adapters/repositories/dishRepository/dish.repository.mock';
import { getMenuRepositoryMock } from '@/adapters/repositories/menuRepository/menu.repository.mock';
import { dietaryRegimeFactory } from '@/domain/entities/dietaryRegime/dietaryRegime.factory';
import { dishFactory } from '@/domain/entities/dish/dish.factory';
import { menuFactory } from '@/domain/entities/menu/menu.factory';

import { CreateMenuUseCase } from './createMenu.useCase';

describe('CreateMenuUseCase', () => {
  const menuRepositoryMock = getMenuRepositoryMock();
  const dishRepositoryMock = getDishRepositoryMock();
  const dietaryRegimeRepositoryMock = getDietaryRegimeRepositoryMock();
  const createMenuUseCase = new CreateMenuUseCase(menuRepositoryMock, dishRepositoryMock, dietaryRegimeRepositoryMock);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create a menu with resolved dishes and regimes', async () => {
    const dishes = [dishFactory(), dishFactory()];
    const regimes = [dietaryRegimeFactory()];
    dishRepositoryMock.findByIds.mockResolvedValue(dishes);
    dietaryRegimeRepositoryMock.findByIds.mockResolvedValue(regimes);
    const menu = menuFactory({ dishes, dietaryRegimes: regimes });
    menuRepositoryMock.create.mockResolvedValue(menu);

    const result = await createMenuUseCase.executeCreateMenu({
      name: 'Menu Prestige',
      price: 85,
      dishIds: dishes.map((d) => d.id),
      dietaryRegimeIds: regimes.map((r) => r.id),
    });

    expect(dishRepositoryMock.findByIds).toHaveBeenCalledWith(dishes.map((d) => d.id));
    expect(dietaryRegimeRepositoryMock.findByIds).toHaveBeenCalledWith(regimes.map((r) => r.id));
    const created = menuRepositoryMock.create.mock.calls[0][0];
    expect(created.dishes).toEqual(dishes);
    expect(created.dietaryRegimes).toEqual(regimes);
    expect(result).toEqual(menu);
  });

  it('should create a menu with empty relations when ids omitted', async () => {
    menuRepositoryMock.create.mockImplementation((m) => Promise.resolve(m));

    await createMenuUseCase.executeCreateMenu({ name: 'Menu Brunch', price: 35 });

    expect(dishRepositoryMock.findByIds).not.toHaveBeenCalled();
    expect(dietaryRegimeRepositoryMock.findByIds).not.toHaveBeenCalled();
    const created = menuRepositoryMock.create.mock.calls[0][0];
    expect(created.dishes).toEqual([]);
    expect(created.dietaryRegimes).toEqual([]);
  });
});
