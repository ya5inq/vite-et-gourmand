import { vi, Mocked } from 'vitest';

import { LogoutUseCaseInterface } from './logout.useCase.interface';

export const getLogoutUseCaseMock = (): Mocked<LogoutUseCaseInterface> => ({
  executeLogout: vi.fn().mockResolvedValue(undefined),
});
