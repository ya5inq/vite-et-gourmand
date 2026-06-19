import { vi, Mocked } from 'vitest';

import { allergenFactory } from '@/domain/entities/allergen/allergen.factory';

import { CreateAllergenUseCaseInterface } from './createAllergen.useCase.interface';

export const getCreateAllergenUseCaseMock = (): Mocked<CreateAllergenUseCaseInterface> => ({
  executeCreateAllergen: vi.fn().mockResolvedValue(allergenFactory()),
});
