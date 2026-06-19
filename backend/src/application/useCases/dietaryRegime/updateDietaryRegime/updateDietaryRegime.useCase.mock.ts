import { vi, Mocked } from 'vitest';

import { dietaryRegimeFactory } from '@/domain/entities/dietaryRegime/dietaryRegime.factory';

import { UpdateDietaryRegimeUseCaseInterface } from './updateDietaryRegime.useCase.interface';

export const getUpdateDietaryRegimeUseCaseMock = (): Mocked<UpdateDietaryRegimeUseCaseInterface> => ({
  executeUpdateDietaryRegime: vi.fn().mockResolvedValue(dietaryRegimeFactory()),
});
