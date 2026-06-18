import { inject, injectable } from 'inversify';

import { AppErrorCodes } from '@/application/errors/app.error.interface';
import { UserInterface } from '@/domain/entities/user/user.entity.interface';
import { LoggerInterface } from '@/domain/interfaces/logger/logger.interface';
import { UserRepositoryInterface } from '@/domain/interfaces/repositories/user.repository.interface';

import { AppError } from '@/application/errors/app.error';
import { TYPES } from '@/configuration/di/types';

import { ExecuteUpdateUserOptions, UpdateUserUseCaseInterface } from './updateUser.useCase.interface';

@injectable()
export class UpdateUserUseCase implements UpdateUserUseCaseInterface {
  constructor(
    @inject(TYPES.UserRepository) private userRepository: UserRepositoryInterface,
    @inject(TYPES.Logger) private loggerService: LoggerInterface,
  ) {}

  async executeUpdateUser({ userId, data }: ExecuteUpdateUserOptions): Promise<UserInterface> {
    // Check if target user exists
    const targetUser = await this.userRepository.findById(userId);
    if (!targetUser) {
      throw new AppError({
        code: AppErrorCodes.NOT_FOUND_USER,
        message: 'User not found',
      });
    }

    // Update user
    await this.userRepository.updateOne(userId, data);

    this.loggerService.info('User updated', {
      userId,
      fields: Object.keys(data),
    });

    // Fetch and return updated user
    const updatedUser = await this.userRepository.findById(userId);
    if (!updatedUser) {
      throw new AppError({
        code: AppErrorCodes.NOT_FOUND_USER,
        message: 'User not found after update',
      });
    }

    return updatedUser;
  }
}
