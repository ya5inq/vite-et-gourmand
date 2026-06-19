import { vi, Mocked } from 'vitest';

import { allergenFactory } from '@/domain/entities/allergen/allergen.factory';

import { UpdateAllergenUseCaseInterface } from './updateAllergen.useCase.interface';

export const getUpdateAllergenUseCaseMock = (): Mocked<UpdateAllergenUseCaseInterface> => ({
  executeUpdateAllergen: vi.fn().mockResolvedValue(allergenFactory()),
});
