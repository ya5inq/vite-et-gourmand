import { describe, beforeEach, vi, expect, it } from 'vitest';

import { getDietaryRegimeRepositoryMock } from '@/adapters/repositories/dietaryRegimeRepository/dietaryRegime.repository.mock';
import { dietaryRegimeFactory } from '@/domain/entities/dietaryRegime/dietaryRegime.factory';

import { GetAllDietaryRegimesUseCase } from './getAllDietaryRegimes.useCase';

describe('GetAllDietaryRegimesUseCase', () => {
  const dietaryRegimeRepositoryMock = getDietaryRegimeRepositoryMock();
  const getAllDietaryRegimesUseCase = new GetAllDietaryRegimesUseCase(dietaryRegimeRepositoryMock);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return regimes and totalCount', async () => {
    const regimes = [dietaryRegimeFactory(), dietaryRegimeFactory()];
    dietaryRegimeRepositoryMock.findAll.mockResolvedValue(regimes);
    dietaryRegimeRepositoryMock.countFindAll.mockResolvedValue(2);

    const result = await getAllDietaryRegimesUseCase.executeGetAllDietaryRegimes();

    expect(result.items).toEqual(regimes);
    expect(result.totalCount).toBe(2);
  });
});
