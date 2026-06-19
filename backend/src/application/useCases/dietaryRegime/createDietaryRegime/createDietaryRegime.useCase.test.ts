import { describe, beforeEach, vi, expect, it } from 'vitest';

import { getDietaryRegimeRepositoryMock } from '@/adapters/repositories/dietaryRegimeRepository/dietaryRegime.repository.mock';
import { dietaryRegimeFactory } from '@/domain/entities/dietaryRegime/dietaryRegime.factory';

import { CreateDietaryRegimeUseCase } from './createDietaryRegime.useCase';

describe('CreateDietaryRegimeUseCase', () => {
  const dietaryRegimeRepositoryMock = getDietaryRegimeRepositoryMock();
  const createDietaryRegimeUseCase = new CreateDietaryRegimeUseCase(dietaryRegimeRepositoryMock);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create a dietary regime', async () => {
    const regime = dietaryRegimeFactory({ name: 'Vegan' });
    dietaryRegimeRepositoryMock.create.mockResolvedValue(regime);

    const result = await createDietaryRegimeUseCase.executeCreateDietaryRegime({ name: 'Vegan' });

    expect(dietaryRegimeRepositoryMock.create).toHaveBeenCalledTimes(1);
    expect(result).toEqual(regime);
  });

  it('should default description to null when not provided', async () => {
    dietaryRegimeRepositoryMock.create.mockImplementation((r) => Promise.resolve(r));

    await createDietaryRegimeUseCase.executeCreateDietaryRegime({ name: 'Halal' });

    const created = dietaryRegimeRepositoryMock.create.mock.calls[0][0];
    expect(created.description).toBeNull();
  });
});
