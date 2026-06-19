import { describe, beforeEach, vi, expect, it } from 'vitest';

import { getAllergenRepositoryMock } from '@/adapters/repositories/allergenRepository/allergen.repository.mock';
import { AppError } from '@/application/errors/app.error';
import { allergenFactory } from '@/domain/entities/allergen/allergen.factory';

import { DeleteAllergenUseCase } from './deleteAllergen.useCase';

describe('DeleteAllergenUseCase', () => {
  const allergenRepositoryMock = getAllergenRepositoryMock();
  const deleteAllergenUseCase = new DeleteAllergenUseCase(allergenRepositoryMock);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should delete an allergen', async () => {
    const allergen = allergenFactory();
    allergenRepositoryMock.findById.mockResolvedValue(allergen);

    await deleteAllergenUseCase.executeDeleteAllergen(allergen.id);

    expect(allergenRepositoryMock.deleteOne).toHaveBeenCalledWith(allergen.id);
  });

  it('should throw NOT_FOUND when allergen does not exist', async () => {
    allergenRepositoryMock.findById.mockResolvedValue(null);

    await expect(deleteAllergenUseCase.executeDeleteAllergen('missing')).rejects.toThrow(AppError);
    expect(allergenRepositoryMock.deleteOne).not.toHaveBeenCalled();
  });
});
