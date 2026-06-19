import { describe, beforeEach, vi, expect, it } from 'vitest';

import { getDietaryRegimeRepositoryMock } from '@/adapters/repositories/dietaryRegimeRepository/dietaryRegime.repository.mock';
import { getDishRepositoryMock } from '@/adapters/repositories/dishRepository/dish.repository.mock';
import { getMenuRepositoryMock } from '@/adapters/repositories/menuRepository/menu.repository.mock';
import { AppError } from '@/application/errors/app.error';
import { dietaryRegimeFactory } from '@/domain/entities/dietaryRegime/dietaryRegime.factory';
import { dishFactory } from '@/domain/entities/dish/dish.factory';
import { menuFactory } from '@/domain/entities/menu/menu.factory';

import { UpdateMenuUseCase } from './updateMenu.useCase';

describe('UpdateMenuUseCase', () => {
  const menuRepositoryMock = getMenuRepositoryMock();
  const dishRepositoryMock = getDishRepositoryMock();
  const dietaryRegimeRepositoryMock = getDietaryRegimeRepositoryMock();
  const updateMenuUseCase = new UpdateMenuUseCase(menuRepositoryMock, dishRepositoryMock, dietaryRegimeRepositoryMock);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should update scalar fields without touching relations', async () => {
    const menu = menuFactory();
    const updated = { ...menu, price: 99 };
    menuRepositoryMock.findById.mockResolvedValueOnce(menu).mockResolvedValueOnce(updated);

    const result = await updateMenuUseCase.executeUpdateMenu({ id: menu.id, data: { price: 99 } });

    expect(dishRepositoryMock.findByIds).not.toHaveBeenCalled();
    expect(dietaryRegimeRepositoryMock.findByIds).not.toHaveBeenCalled();
    expect(menuRepositoryMock.updateOne).toHaveBeenCalledWith(menu.id, { price: 99 });
    expect(result).toEqual(updated);
  });

  it('should resolve and replace relations when ids provided', async () => {
    const menu = menuFactory();
    const dishes = [dishFactory()];
    const regimes = [dietaryRegimeFactory()];
    dishRepositoryMock.findByIds.mockResolvedValue(dishes);
    dietaryRegimeRepositoryMock.findByIds.mockResolvedValue(regimes);
    menuRepositoryMock.findById.mockResolvedValueOnce(menu).mockResolvedValueOnce(menu);

    await updateMenuUseCase.executeUpdateMenu({
      id: menu.id,
      data: { dishIds: dishes.map((d) => d.id), dietaryRegimeIds: regimes.map((r) => r.id) },
    });

    expect(menuRepositoryMock.updateOne).toHaveBeenCalledWith(menu.id, { dishes, dietaryRegimes: regimes });
  });

  it('should throw NOT_FOUND when menu does not exist', async () => {
    menuRepositoryMock.findById.mockResolvedValue(null);

    await expect(updateMenuUseCase.executeUpdateMenu({ id: 'missing', data: { price: 1 } })).rejects.toThrow(AppError);
    expect(menuRepositoryMock.updateOne).not.toHaveBeenCalled();
  });
});
