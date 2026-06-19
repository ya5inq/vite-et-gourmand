import { describe, beforeEach, vi, expect, it } from 'vitest';

import { getMenuRepositoryMock } from '@/adapters/repositories/menuRepository/menu.repository.mock';
import { menuFactory } from '@/domain/entities/menu/menu.factory';

import { GetAllMenusUseCase } from './getAllMenus.useCase';

describe('GetAllMenusUseCase', () => {
  const menuRepositoryMock = getMenuRepositoryMock();
  const getAllMenusUseCase = new GetAllMenusUseCase(menuRepositoryMock);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return menus and totalCount via findAll + countFindAll', async () => {
    const menus = [menuFactory(), menuFactory()];
    menuRepositoryMock.findAll.mockResolvedValue(menus);
    menuRepositoryMock.countFindAll.mockResolvedValue(2);

    const result = await getAllMenusUseCase.executeGetAllMenus({ theme: 'Gastronomique' });

    expect(menuRepositoryMock.findAll).toHaveBeenCalledWith({ theme: 'Gastronomique' });
    expect(menuRepositoryMock.countFindAll).toHaveBeenCalledWith({ theme: 'Gastronomique' });
    expect(result.items).toEqual(menus);
    expect(result.totalCount).toBe(2);
  });
});
