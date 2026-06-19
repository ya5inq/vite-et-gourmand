import { inject, injectable } from 'inversify';

import { AppErrorCodes } from '@/application/errors/app.error.interface';
import { PasswordServiceInterface } from '@/application/services/password/password.service.interface';
import { UserTokenServiceInterface } from '@/application/services/userToken/userToken.service.interface';
import { UserTokenTypeEnum } from '@/domain/entities/userToken/userToken.entity.interface';
import { LoggerInterface } from '@/domain/interfaces/logger/logger.interface';
import { UserRepositoryInterface } from '@/domain/interfaces/repositories/user.repository.interface';
import { UserTokenRepositoryInterface } from '@/domain/interfaces/repositories/userToken.repository.interface';

import { AppError } from '@/application/errors/app.error';
import { TYPES } from '@/configuration/di/types';

import {
  SetEmployeePasswordInputInterface,
  SetEmployeePasswordUseCaseInterface,
} from './setEmployeePassword.useCase.interface';

@injectable()
export class SetEmployeePasswordUseCase implements SetEmployeePasswordUseCaseInterface {
  constructor(
    @inject(TYPES.UserTokenService) private userTokenService: UserTokenServiceInterface,
    @inject(TYPES.UserRepository) private userRepository: UserRepositoryInterface,
    @inject(TYPES.UserTokenRepository) private userTokenRepository: UserTokenRepositoryInterface,
    @inject(TYPES.PasswordService) private passwordService: PasswordServiceInterface,
    @inject(TYPES.Logger) private logger: LoggerInterface,
  ) {}

  async executeSetEmployeePassword({ tokenValue, newPassword }: SetEmployeePasswordInputInterface): Promise<void> {
    const token = await this.userTokenRepository.findByTokenValue(tokenValue);
    const verifiedToken = this.userTokenService.verifyToken({
      token,
      tokenValue,
      tokenType: UserTokenTypeEnum.employeeSetPassword,
    });

    const isValidPassword = this.passwordService.checkPasswordComplexity(newPassword);
    if (!isValidPassword) {
      throw new AppError({
        message: 'Invalid password complexity',
        code: AppErrorCodes.BAD_REQUEST_INVALID_PASSWORD_COMPLEXITY,
      });
    }

    const user = await this.userRepository.findById(verifiedToken.userId);
    if (!user) {
      throw new AppError({
        message: 'User not found',
        code: AppErrorCodes.NOT_FOUND_USER,
        privateContext: { userId: verifiedToken.userId },
      });
    }

    const hashedPassword = await this.passwordService.hashPassword(newPassword);
    // Activate the account on first password set and mark the email as verified.
    await this.userRepository.updateOne(user.id, {
      password: hashedPassword,
      isActive: true,
      emailVerified: true,
    });
    await this.userTokenRepository.deleteUserTokens(user.id, [
      UserTokenTypeEnum.employeeSetPassword,
      UserTokenTypeEnum.refreshToken,
    ]);

    this.logger.debug('Employee password set', { userId: user.id });
  }
}
