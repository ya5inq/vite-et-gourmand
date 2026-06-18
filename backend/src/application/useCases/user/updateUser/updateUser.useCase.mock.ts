import { vi, Mocked } from 'vitest';

import { userFactory } from '@/domain/entities/user/user.factory';

import { UpdateUserUseCaseInterface } from './updateUser.useCase.interface';

export const getUpdateUserUseCaseMock = (): Mocked<UpdateUserUseCaseInterface> => ({
  executeUpdateUser: vi.fn().mockResolvedValue(userFactory()),
});
