import { vi, Mocked } from 'vitest';

import { userFactory } from '@/domain/entities/user/user.factory';

import { GetUserUseCaseInterface } from './getUser.useCase.interface';

export const getUserUseCaseMock = (): Mocked<GetUserUseCaseInterface> => ({
  executeGetUser: vi.fn().mockResolvedValue(userFactory()),
});
