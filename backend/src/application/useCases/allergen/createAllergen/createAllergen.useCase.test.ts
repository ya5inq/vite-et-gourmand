import { describe, beforeEach, vi, expect, it } from 'vitest';

import { getAllergenRepositoryMock } from '@/adapters/repositories/allergenRepository/allergen.repository.mock';
import { allergenFactory } from '@/domain/entities/allergen/allergen.factory';

import { CreateAllergenUseCase } from './createAllergen.useCase';

describe('CreateAllergenUseCase', () => {
  const allergenRepositoryMock = getAllergenRepositoryMock();
  const createAllergenUseCase = new CreateAllergenUseCase(allergenRepositoryMock);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create an allergen', async () => {
    const allergen = allergenFactory({ name: 'Gluten', icon: 'wheat' });
    allergenRepositoryMock.create.mockResolvedValue(allergen);

    const result = await createAllergenUseCase.executeCreateAllergen({ name: 'Gluten', icon: 'wheat' });

    expect(allergenRepositoryMock.create).toHaveBeenCalledTimes(1);
    expect(result).toEqual(allergen);
  });

  it('should default icon to null when not provided', async () => {
    allergenRepositoryMock.create.mockImplementation((a) => Promise.resolve(a));

    await createAllergenUseCase.executeCreateAllergen({ name: 'Soja' });

    const created = allergenRepositoryMock.create.mock.calls[0][0];
    expect(created.icon).toBeNull();
    expect(created.name).toBe('Soja');
  });
});
