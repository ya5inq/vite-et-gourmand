import { vi, Mocked } from 'vitest';

import { DeleteMenuUseCaseInterface } from './deleteMenu.useCase.interface';

export const getDeleteMenuUseCaseMock = (): Mocked<DeleteMenuUseCaseInterface> => ({
  executeDeleteMenu: vi.fn().mockResolvedValue(undefined),
});
