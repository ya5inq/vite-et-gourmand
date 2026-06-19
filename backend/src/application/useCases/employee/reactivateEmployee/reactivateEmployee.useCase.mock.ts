import { Mocked, vi } from 'vitest';

import { userFactory } from '@/domain/entities/user/user.factory';

import { ReactivateEmployeeUseCaseInterface } from './reactivateEmployee.useCase.interface';

export const getReactivateEmployeeUseCaseMock = (): Mocked<ReactivateEmployeeUseCaseInterface> => ({
  executeReactivateEmployee: vi.fn().mockResolvedValue(userFactory()),
});
