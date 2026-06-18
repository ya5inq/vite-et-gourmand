import { vi, Mocked } from 'vitest';

import { UserInterface } from '@/domain/entities/user/user.entity.interface';
import { UserRepositoryInterface } from '@/domain/interfaces/repositories/user.repository.interface';

export const getUserRepositoryMock = (options?: {
  findByEmail?: UserInterface | null;
  findById?: UserInterface | null;
  findAll?: UserInterface[];
  countFindAll?: number;
}): Mocked<UserRepositoryInterface> => ({
  findByEmail: vi.fn().mockResolvedValue(options?.findByEmail ?? null),
  findById: vi.fn().mockResolvedValue(options?.findById ?? null),
  updateOne: vi.fn().mockResolvedValue(undefined),
  create: vi.fn().mockResolvedValue(undefined),
  deleteOne: vi.fn().mockResolvedValue(undefined),
  findAll: vi.fn().mockResolvedValue(options?.findAll ?? []),
  countFindAll: vi.fn().mockResolvedValue(options?.countFindAll ?? 0),
});
