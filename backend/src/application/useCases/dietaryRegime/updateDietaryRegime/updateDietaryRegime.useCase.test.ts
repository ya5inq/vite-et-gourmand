import { describe, beforeEach, vi, expect, it } from 'vitest';

import { getDietaryRegimeRepositoryMock } from '@/adapters/repositories/dietaryRegimeRepository/dietaryRegime.repository.mock';
import { AppError } from '@/application/errors/app.error';
import { dietaryRegimeFactory } from '@/domain/entities/dietaryRegime/dietaryRegime.factory';

import { UpdateDietaryRegimeUseCase } from './updateDietaryRegime.useCase';

describe('UpdateDietaryRegimeUseCase', () => {
  const dietaryRegimeRepositoryMock = getDietaryRegimeRepositoryMock();
  const updateDietaryRegimeUseCase = new UpdateDietaryRegimeUseCase(dietaryRegimeRepositoryMock);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should update a dietary regime', async () => {
    const regime = dietaryRegimeFactory({ name: 'Vegan' });
    const updated = { ...regime, name: 'Végétalien' };
    dietaryRegimeRepositoryMock.findById.mockResolvedValueOnce(regime).mockResolvedValueOnce(updated);

    const result = await updateDietaryRegimeUseCase.executeUpdateDietaryRegime({
      id: regime.id,
      data: { name: 'Végétalien' },
    });

    expect(dietaryRegimeRepositoryMock.updateOne).toHaveBeenCalledWith(regime.id, { name: 'Végétalien' });
    expect(result).toEqual(updated);
  });

  it('should throw NOT_FOUND when regime does not exist', async () => {
    dietaryRegimeRepositoryMock.findById.mockResolvedValue(null);

    await expect(
      updateDietaryRegimeUseCase.executeUpdateDietaryRegime({ id: 'missing', data: { name: 'X' } }),
    ).rejects.toThrow(AppError);
    expect(dietaryRegimeRepositoryMock.updateOne).not.toHaveBeenCalled();
  });
});
