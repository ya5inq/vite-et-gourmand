import { vi, Mocked } from 'vitest';

import { GetAllDietaryRegimesUseCaseInterface } from './getAllDietaryRegimes.useCase.interface';

export const getGetAllDietaryRegimesUseCaseMock = (): Mocked<GetAllDietaryRegimesUseCaseInterface> => ({
  executeGetAllDietaryRegimes: vi.fn().mockResolvedValue({ items: [], totalCount: 0 }),
});
