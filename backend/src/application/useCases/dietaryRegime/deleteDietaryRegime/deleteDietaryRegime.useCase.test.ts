import { describe, beforeEach, vi, expect, it } from 'vitest';

import { getDietaryRegimeRepositoryMock } from '@/adapters/repositories/dietaryRegimeRepository/dietaryRegime.repository.mock';
import { AppError } from '@/application/errors/app.error';
import { dietaryRegimeFactory } from '@/domain/entities/dietaryRegime/dietaryRegime.factory';

import { DeleteDietaryRegimeUseCase } from './deleteDietaryRegime.useCase';

describe('DeleteDietaryRegimeUseCase', () => {
  const dietaryRegimeRepositoryMock = getDietaryRegimeRepositoryMock();
  const deleteDietaryRegimeUseCase = new DeleteDietaryRegimeUseCase(dietaryRegimeRepositoryMock);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should delete a dietary regime', async () => {
    const regime = dietaryRegimeFactory();
    dietaryRegimeRepositoryMock.findById.mockResolvedValue(regime);

    await deleteDietaryRegimeUseCase.executeDeleteDietaryRegime(regime.id);

    expect(dietaryRegimeRepositoryMock.deleteOne).toHaveBeenCalledWith(regime.id);
  });

  it('should throw NOT_FOUND when regime does not exist', async () => {
    dietaryRegimeRepositoryMock.findById.mockResolvedValue(null);

    await expect(deleteDietaryRegimeUseCase.executeDeleteDietaryRegime('missing')).rejects.toThrow(AppError);
    expect(dietaryRegimeRepositoryMock.deleteOne).not.toHaveBeenCalled();
  });
});
