import { describe, beforeEach, vi, expect, it } from 'vitest';

import { getMenuRepositoryMock } from '@/adapters/repositories/menuRepository/menu.repository.mock';
import { AppError } from '@/application/errors/app.error';
import { menuFactory } from '@/domain/entities/menu/menu.factory';

import { DeleteMenuUseCase } from './deleteMenu.useCase';

describe('DeleteMenuUseCase', () => {
  const menuRepositoryMock = getMenuRepositoryMock();
  const deleteMenuUseCase = new DeleteMenuUseCase(menuRepositoryMock);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should delete a menu', async () => {
    const menu = menuFactory();
    menuRepositoryMock.findById.mockResolvedValue(menu);

    await deleteMenuUseCase.executeDeleteMenu(menu.id);

    expect(menuRepositoryMock.deleteOne).toHaveBeenCalledWith(menu.id);
  });

  it('should throw NOT_FOUND when menu does not exist', async () => {
    menuRepositoryMock.findById.mockResolvedValue(null);

    await expect(deleteMenuUseCase.executeDeleteMenu('missing')).rejects.toThrow(AppError);
    expect(menuRepositoryMock.deleteOne).not.toHaveBeenCalled();
  });
});
