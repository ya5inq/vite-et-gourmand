/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { describe, beforeEach, vi, expect, it } from 'vitest';

import { AppErrorCodes } from '@/application/errors/app.error.interface';

import { getLoggerMock } from '@/adapters/logger/logger.mock';
import { getUserRepositoryMock } from '@/adapters/repositories/userRepository/user.repository.mock';
import { AppError } from '@/application/errors/app.error';
import { userFactory } from '@/domain/entities/user/user.factory';

import { UpdateUserUseCase } from './updateUser.useCase';

describe('UpdateUserUseCase', () => {
  const loggerServiceMock = getLoggerMock();
  let userRepositoryMock: ReturnType<typeof getUserRepositoryMock>;
  let updateUserUseCase: UpdateUserUseCase;

  beforeEach(() => {
    vi.clearAllMocks();
    userRepositoryMock = getUserRepositoryMock();
    updateUserUseCase = new UpdateUserUseCase(userRepositoryMock, loggerServiceMock);
  });

  it('should successfully update a user', async () => {
    const currentUser = userFactory();
    const targetUser = userFactory({
      firstName: 'John',
      lastName: 'Doe',
      phone: '1234567890',
    });
    const updateData = {
      firstName: 'Jane',
      lastName: 'Smith',
      phone: '0987654321',
    };
    const updatedUser = {
      ...targetUser,
      ...updateData,
    };

    userRepositoryMock.findById = vi.fn().mockResolvedValueOnce(targetUser).mockResolvedValueOnce(updatedUser);
    userRepositoryMock.updateOne = vi.fn().mockResolvedValue(undefined);

    const result = await updateUserUseCase.executeUpdateUser({
      currentUser,
      userId: targetUser.id,
      data: updateData,
    });

    expect(userRepositoryMock.findById).toHaveBeenCalledTimes(2);
    expect(userRepositoryMock.updateOne).toHaveBeenCalledWith(targetUser.id, updateData);
    expect(loggerServiceMock.info).toHaveBeenCalledWith('User updated', {
      userId: targetUser.id,
      fields: ['firstName', 'lastName', 'phone'],
    });
    expect(result).toEqual(updatedUser);
  });

  it('should throw USER_NOT_FOUND error if target user does not exist', async () => {
    const currentUser = userFactory();
    const targetUserId = 'f2e9ae1a-c21c-4e7f-bdb7-3acef38bfe74';
    const updateData = { firstName: 'Jane' };

    userRepositoryMock.findById = vi.fn().mockResolvedValue(null);

    await expect(
      updateUserUseCase.executeUpdateUser({ currentUser, userId: targetUserId, data: updateData }),
    ).rejects.toThrow(AppError);

    await expect(
      updateUserUseCase.executeUpdateUser({ currentUser, userId: targetUserId, data: updateData }),
    ).rejects.toMatchObject({
      code: AppErrorCodes.NOT_FOUND_USER,
      message: 'User not found',
    });

    expect(userRepositoryMock.findById).toHaveBeenCalledWith(targetUserId);
    expect(userRepositoryMock.updateOne).not.toHaveBeenCalled();
  });

  it('should throw error if repository updateOne fails', async () => {
    const currentUser = userFactory();
    const targetUser = userFactory({ firstName: 'John' });
    const updateData = { firstName: 'Jane' };

    userRepositoryMock.findById = vi.fn().mockResolvedValue(targetUser);
    userRepositoryMock.updateOne = vi.fn().mockRejectedValue(new Error('Database error'));

    await expect(
      updateUserUseCase.executeUpdateUser({ currentUser, userId: targetUser.id, data: updateData }),
    ).rejects.toThrow('Database error');

    expect(userRepositoryMock.updateOne).toHaveBeenCalledWith(targetUser.id, updateData);
    expect(loggerServiceMock.info).not.toHaveBeenCalled();
  });

  it('should successfully update user with null phone', async () => {
    const currentUser = userFactory();
    const targetUser = userFactory({ phone: '1234567890' });
    const updateData = { phone: null };
    const updatedUser = { ...targetUser, phone: null };

    userRepositoryMock.findById = vi.fn().mockResolvedValueOnce(targetUser).mockResolvedValueOnce(updatedUser);
    userRepositoryMock.updateOne = vi.fn().mockResolvedValue(undefined);

    const result = await updateUserUseCase.executeUpdateUser({
      currentUser,
      userId: targetUser.id,
      data: updateData,
    });

    expect(userRepositoryMock.updateOne).toHaveBeenCalledWith(targetUser.id, updateData);
    expect(result.phone).toBeNull();
  });
});
