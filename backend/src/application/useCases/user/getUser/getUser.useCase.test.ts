import { describe, beforeEach, vi, expect, it } from 'vitest';

import { getUserRepositoryMock } from '@/adapters/repositories/userRepository/user.repository.mock';
import { AppError } from '@/application/errors/app.error';
import { userFactory } from '@/domain/entities/user/user.factory';

import { GetUserUseCase } from './getUser.useCase';

describe('GetUserUseCase', () => {
  const userRepositoryMock = getUserRepositoryMock();
  const getUserUseCase = new GetUserUseCase(userRepositoryMock);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return user - should not be same user', async () => {
    const currentUser = userFactory();
    const user = userFactory();
    userRepositoryMock.findById.mockResolvedValue(user);

    const responseUser = await getUserUseCase.executeGetUser({
      currentUser,
      userId: user.id,
      shouldBeSameUser: false,
    });

    expect(responseUser).toEqual(user);
  });
  it('should return user - should be same user', async () => {
    const currentUser = userFactory();
    userRepositoryMock.findById.mockResolvedValue(currentUser);

    const responseUser = await getUserUseCase.executeGetUser({
      currentUser,
      userId: currentUser.id,
      shouldBeSameUser: true,
    });

    expect(responseUser).toEqual(currentUser);
  });
  it('should throw error - current user is different from user', async () => {
    const currentUser = userFactory();
    const user = userFactory();
    userRepositoryMock.findById.mockResolvedValue(user);

    await expect(
      getUserUseCase.executeGetUser({ currentUser, userId: user.id, shouldBeSameUser: true }),
    ).rejects.toThrow(AppError);
  });
  it('should throw error - user not found', async () => {
    const currentUser = userFactory();
    userRepositoryMock.findById.mockResolvedValue(null);

    await expect(getUserUseCase.executeGetUser({ currentUser, userId: '2', shouldBeSameUser: false })).rejects.toThrow(
      AppError,
    );
  });
});
