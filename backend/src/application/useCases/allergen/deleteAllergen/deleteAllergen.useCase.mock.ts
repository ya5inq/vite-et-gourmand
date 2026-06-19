import { vi, Mocked } from 'vitest';

import { DeleteAllergenUseCaseInterface } from './deleteAllergen.useCase.interface';

export const getDeleteAllergenUseCaseMock = (): Mocked<DeleteAllergenUseCaseInterface> => ({
  executeDeleteAllergen: vi.fn().mockResolvedValue(undefined),
});
