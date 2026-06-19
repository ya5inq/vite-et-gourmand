import { Mocked, vi } from 'vitest';

import { userFactory } from '@/domain/entities/user/user.factory';

import { DeactivateEmployeeUseCaseInterface } from './deactivateEmployee.useCase.interface';

export const getDeactivateEmployeeUseCaseMock = (): Mocked<DeactivateEmployeeUseCaseInterface> => ({
  executeDeactivateEmployee: vi.fn().mockResolvedValue(userFactory()),
});
