import { vi, Mocked } from 'vitest';

import { DietaryRegimeInterface } from '@/domain/entities/dietaryRegime/dietaryRegime.entity.interface';
import { DietaryRegimeRepositoryInterface } from '@/domain/interfaces/repositories/dietaryRegime.repository.interface';

import { dietaryRegimeFactory } from '@/domain/entities/dietaryRegime/dietaryRegime.factory';

export const getDietaryRegimeRepositoryMock = (options?: {
  findById?: DietaryRegimeInterface | null;
  findAll?: DietaryRegimeInterface[];
  countFindAll?: number;
}): Mocked<DietaryRegimeRepositoryInterface> => ({
  findById: vi.fn().mockResolvedValue(options?.findById ?? null),
  findByIds: vi.fn().mockResolvedValue(options?.findAll ?? []),
  findAll: vi.fn().mockResolvedValue(options?.findAll ?? []),
  countFindAll: vi.fn().mockResolvedValue(options?.countFindAll ?? 0),
  create: vi
    .fn()
    .mockImplementation((regime: DietaryRegimeInterface) => Promise.resolve(regime ?? dietaryRegimeFactory())),
  updateOne: vi.fn().mockResolvedValue(undefined),
  deleteOne: vi.fn().mockResolvedValue(undefined),
});
