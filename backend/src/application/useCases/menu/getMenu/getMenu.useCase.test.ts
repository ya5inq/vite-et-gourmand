import { describe, beforeEach, vi, expect, it } from 'vitest';

import { getMenuRepositoryMock } from '@/adapters/repositories/menuRepository/menu.repository.mock';
import { AppError } from '@/application/errors/app.error';
import { menuFactory } from '@/domain/entities/menu/menu.factory';

import { GetMenuUseCase } from './getMenu.useCase';

describe('GetMenuUseCase', () => {
  const menuRepositoryMock = getMenuRepositoryMock();
  const getMenuUseCase = new GetMenuUseCase(menuRepositoryMock);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return a menu', async () => {
    const menu = menuFactory();
    menuRepositoryMock.findById.mockResolvedValue(menu);

    const result = await getMenuUseCase.executeGetMenu(menu.id);

    expect(result).toEqual(menu);
  });

  it('should throw NOT_FOUND when menu does not exist', async () => {
    menuRepositoryMock.findById.mockResolvedValue(null);

    await expect(getMenuUseCase.executeGetMenu('missing')).rejects.toThrow(AppError);
  });
});
