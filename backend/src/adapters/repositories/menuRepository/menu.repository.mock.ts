import { vi, Mocked } from 'vitest';

import { MenuInterface } from '@/domain/entities/menu/menu.entity.interface';
import { MenuRepositoryInterface } from '@/domain/interfaces/repositories/menu.repository.interface';

import { menuFactory } from '@/domain/entities/menu/menu.factory';

export const getMenuRepositoryMock = (options?: {
  findById?: MenuInterface | null;
  findAll?: MenuInterface[];
  countFindAll?: number;
}): Mocked<MenuRepositoryInterface> => ({
  findById: vi.fn().mockResolvedValue(options?.findById ?? null),
  findAll: vi.fn().mockResolvedValue(options?.findAll ?? []),
  countFindAll: vi.fn().mockResolvedValue(options?.countFindAll ?? 0),
  create: vi.fn().mockImplementation((menu: MenuInterface) => Promise.resolve(menu ?? menuFactory())),
  updateOne: vi.fn().mockResolvedValue(undefined),
  deleteOne: vi.fn().mockResolvedValue(undefined),
});
