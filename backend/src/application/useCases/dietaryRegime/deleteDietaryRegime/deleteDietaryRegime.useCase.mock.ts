import { vi, Mocked } from 'vitest';

import { DeleteDietaryRegimeUseCaseInterface } from './deleteDietaryRegime.useCase.interface';

export const getDeleteDietaryRegimeUseCaseMock = (): Mocked<DeleteDietaryRegimeUseCaseInterface> => ({
  executeDeleteDietaryRegime: vi.fn().mockResolvedValue(undefined),
});
