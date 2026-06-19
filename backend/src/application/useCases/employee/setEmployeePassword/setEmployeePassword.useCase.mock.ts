import { Mocked, vi } from 'vitest';

import { SetEmployeePasswordUseCaseInterface } from './setEmployeePassword.useCase.interface';

export const getSetEmployeePasswordUseCaseMock = (): Mocked<SetEmployeePasswordUseCaseInterface> => ({
  executeSetEmployeePassword: vi.fn().mockResolvedValue(undefined),
});
