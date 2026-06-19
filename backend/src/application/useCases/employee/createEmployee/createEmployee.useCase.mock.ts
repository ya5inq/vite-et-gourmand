import { Mocked, vi } from 'vitest';

import { userFactory } from '@/domain/entities/user/user.factory';

import { CreateEmployeeUseCaseInterface } from './createEmployee.useCase.interface';

export const getCreateEmployeeUseCaseMock = (): Mocked<CreateEmployeeUseCaseInterface> => ({
  executeCreateEmployee: vi.fn().mockResolvedValue(userFactory()),
});
