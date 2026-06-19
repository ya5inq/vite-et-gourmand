import { vi, Mocked } from 'vitest';

import { dietaryRegimeFactory } from '@/domain/entities/dietaryRegime/dietaryRegime.factory';

import { CreateDietaryRegimeUseCaseInterface } from './createDietaryRegime.useCase.interface';

export const getCreateDietaryRegimeUseCaseMock = (): Mocked<CreateDietaryRegimeUseCaseInterface> => ({
  executeCreateDietaryRegime: vi.fn().mockResolvedValue(dietaryRegimeFactory()),
});
