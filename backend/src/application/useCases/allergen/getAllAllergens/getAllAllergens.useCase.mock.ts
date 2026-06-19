import { vi, Mocked } from 'vitest';

import { GetAllAllergensUseCaseInterface } from './getAllAllergens.useCase.interface';

export const getGetAllAllergensUseCaseMock = (): Mocked<GetAllAllergensUseCaseInterface> => ({
  executeGetAllAllergens: vi.fn().mockResolvedValue({ items: [], totalCount: 0 }),
});
