import { vi, Mocked } from 'vitest';

import { GetAllMenusUseCaseInterface } from './getAllMenus.useCase.interface';

export const getGetAllMenusUseCaseMock = (): Mocked<GetAllMenusUseCaseInterface> => ({
  executeGetAllMenus: vi.fn().mockResolvedValue({ items: [], totalCount: 0 }),
});
