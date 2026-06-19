import { describe, beforeEach, vi, expect, it } from 'vitest';

import { getAllergenRepositoryMock } from '@/adapters/repositories/allergenRepository/allergen.repository.mock';
import { allergenFactory } from '@/domain/entities/allergen/allergen.factory';

import { GetAllAllergensUseCase } from './getAllAllergens.useCase';

describe('GetAllAllergensUseCase', () => {
  const allergenRepositoryMock = getAllergenRepositoryMock();
  const getAllAllergensUseCase = new GetAllAllergensUseCase(allergenRepositoryMock);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return allergens and totalCount', async () => {
    const allergens = [allergenFactory(), allergenFactory()];
    allergenRepositoryMock.findAll.mockResolvedValue(allergens);
    allergenRepositoryMock.countFindAll.mockResolvedValue(2);

    const result = await getAllAllergensUseCase.executeGetAllAllergens();

    expect(result.items).toEqual(allergens);
    expect(result.totalCount).toBe(2);
  });
});
