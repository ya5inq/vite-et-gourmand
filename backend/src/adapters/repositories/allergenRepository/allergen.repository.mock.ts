import { vi, Mocked } from 'vitest';

import { AllergenInterface } from '@/domain/entities/allergen/allergen.entity.interface';
import { AllergenRepositoryInterface } from '@/domain/interfaces/repositories/allergen.repository.interface';

import { allergenFactory } from '@/domain/entities/allergen/allergen.factory';

export const getAllergenRepositoryMock = (options?: {
  findById?: AllergenInterface | null;
  findAll?: AllergenInterface[];
  countFindAll?: number;
}): Mocked<AllergenRepositoryInterface> => ({
  findById: vi.fn().mockResolvedValue(options?.findById ?? null),
  findByIds: vi.fn().mockResolvedValue(options?.findAll ?? []),
  findAll: vi.fn().mockResolvedValue(options?.findAll ?? []),
  countFindAll: vi.fn().mockResolvedValue(options?.countFindAll ?? 0),
  create: vi.fn().mockImplementation((allergen: AllergenInterface) => Promise.resolve(allergen ?? allergenFactory())),
  updateOne: vi.fn().mockResolvedValue(undefined),
  deleteOne: vi.fn().mockResolvedValue(undefined),
});
