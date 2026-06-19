import { describe, beforeEach, vi, expect, it } from 'vitest';

import { getAllergenRepositoryMock } from '@/adapters/repositories/allergenRepository/allergen.repository.mock';
import { AppError } from '@/application/errors/app.error';
import { allergenFactory } from '@/domain/entities/allergen/allergen.factory';

import { UpdateAllergenUseCase } from './updateAllergen.useCase';

describe('UpdateAllergenUseCase', () => {
  const allergenRepositoryMock = getAllergenRepositoryMock();
  const updateAllergenUseCase = new UpdateAllergenUseCase(allergenRepositoryMock);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should update an allergen', async () => {
    const allergen = allergenFactory({ name: 'Gluten' });
    const updated = { ...allergen, name: 'Gluten modifié' };
    allergenRepositoryMock.findById.mockResolvedValueOnce(allergen).mockResolvedValueOnce(updated);

    const result = await updateAllergenUseCase.executeUpdateAllergen({
      id: allergen.id,
      data: { name: 'Gluten modifié' },
    });

    expect(allergenRepositoryMock.updateOne).toHaveBeenCalledWith(allergen.id, { name: 'Gluten modifié' });
    expect(result).toEqual(updated);
  });

  it('should throw NOT_FOUND when allergen does not exist', async () => {
    allergenRepositoryMock.findById.mockResolvedValue(null);

    await expect(updateAllergenUseCase.executeUpdateAllergen({ id: 'missing', data: { name: 'X' } })).rejects.toThrow(
      AppError,
    );
    expect(allergenRepositoryMock.updateOne).not.toHaveBeenCalled();
  });
});
