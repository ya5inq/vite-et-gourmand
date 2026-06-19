import { inject, injectable } from 'inversify';
import { v4 } from 'uuid';

import { AppErrorCodes } from '@/application/errors/app.error.interface';
import { AuthServiceInterface } from '@/application/services/authToken/authToken.service.interface';
import { EnvConfigInterface } from '@/domain/interfaces/adapters/envConfig.interface';
import { LoggerInterface } from '@/domain/interfaces/logger/logger.interface';
import { UserRepositoryInterface } from '@/domain/interfaces/repositories/user.repository.interface';
import { UserTokenRepositoryInterface } from '@/domain/interfaces/repositories/userToken.repository.interface';

import { AppError } from '@/application/errors/app.error';
import { TYPES } from '@/configuration/di/types';

import { RefreshUseCaseInterface } from './refresh.useCase.interface';

@injectable()
export class RefreshUseCase implements RefreshUseCaseInterface {
  constructor(
    @inject(TYPES.UserRepository) private userRepository: UserRepositoryInterface,
    @inject(TYPES.UserTokenRepository) private userTokenRepository: UserTokenRepositoryInterface,
    @inject(TYPES.AuthService) private authService: AuthServiceInterface,
    @inject(TYPES.Logger) private loggerService: LoggerInterface,
    @inject(TYPES.EnvConfig) private envConfig: EnvConfigInterface,
  ) {}

  async executeRefresh(
    refreshTokenValue: string,
    accessToken?: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    // The user is resolved from the refresh token stored in DB. This allows
    // cookie-only refresh (SSR clients keep no access token client-side).
    const refreshToken = await this.userTokenRepository.findByTokenValue(refreshTokenValue);
    if (!refreshToken) {
      throw new AppError({
        message: 'Refresh token not found',
        code: AppErrorCodes.UNAUTHORIZED_TOKEN_NOT_FOUND,
      });
    }

    const userId = refreshToken.userId;

    // Defense in depth: when an access token is supplied, it must match the user.
    if (accessToken) {
      const payload = await this.authService.verifyAccessToken(accessToken, true);
      if (payload.userId !== userId) {
        throw new AppError({
          message: 'Access token does not match refresh token',
          code: AppErrorCodes.UNAUTHORIZED_INVALID_JWT,
          privateContext: { userId, payloadUserId: payload.userId },
        });
      }
    }

    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new AppError({
        message: 'User not found',
        code: AppErrorCodes.NOT_FOUND_USER,
        privateContext: { userId },
      });
    }

    const validatedToken = this.authService.verifyRefreshToken({
      token: refreshToken,
      tokenValue: refreshTokenValue,
      userId,
    });

    const newAccessToken = await this.authService.generateAccessToken(userId, user);
    const newRefreshTokenValue = v4();
    await this.userTokenRepository.update({
      oldTokenValue: validatedToken.value,
      newTokenValue: newRefreshTokenValue,
      expirationDate: new Date(Date.now() + 1000 * this.envConfig.refreshTokenExpiration),
    });

    this.loggerService.debug(`Refresh successful: New tokens generated for user ${userId}`);
    return { accessToken: newAccessToken, refreshToken: newRefreshTokenValue };
  }
}
