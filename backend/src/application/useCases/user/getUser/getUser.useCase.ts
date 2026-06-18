import { inject, injectable } from 'inversify';

import { AppErrorCodes } from '@/application/errors/app.error.interface';
import { UserInterface } from '@/domain/entities/user/user.entity.interface';
import { UserRepositoryInterface } from '@/domain/interfaces/repositories/user.repository.interface';

import { AppError } from '@/application/errors/app.error';
import { TYPES } from '@/configuration/di/types';

import { GetUserUseCaseInterface, ExecuteGetUserOptions } from './getUser.useCase.interface';

@injectable()
export class GetUserUseCase implements GetUserUseCaseInterface {
  constructor(@inject(TYPES.UserRepository) private userRepository: UserRepositoryInterface) {}
  async executeGetUser({
    currentUser,
    userId,
    shouldBeSameUser = false,
  }: ExecuteGetUserOptions): Promise<UserInterface> {
    const isSameUser = currentUser?.id === userId;

    if (shouldBeSameUser && !isSameUser) {
      throw new AppError({
        code: AppErrorCodes.FORBIDDEN_NOT_ALLOWED,
        message: 'User not allowed to access this user',
        privateContext: { currentUserId: currentUser?.id, userId, shouldBeSameUser },
      });
    }

    const user = isSameUser ? currentUser : await this.userRepository.findById(userId);
    if (!user) {
      throw new AppError({
        code: AppErrorCodes.NOT_FOUND_USER,
        message: 'User not found',
        privateContext: { userId },
      });
    }

    return user;
  }
}
