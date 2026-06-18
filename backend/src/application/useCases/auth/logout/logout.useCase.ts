import { inject, injectable } from 'inversify';

import { LoggerInterface } from '@/domain/interfaces/logger/logger.interface';
import { UserTokenRepositoryInterface } from '@/domain/interfaces/repositories/userToken.repository.interface';

import { TYPES } from '@/configuration/di/types';

import { LogoutUseCaseInterface } from './logout.useCase.interface';

@injectable()
export class LogoutUseCase implements LogoutUseCaseInterface {
  constructor(
    @inject(TYPES.UserTokenRepository) private userTokenRepository: UserTokenRepositoryInterface,
    @inject(TYPES.Logger) private loggerService: LoggerInterface,
  ) {}

  async executeLogout(refreshTokenValue?: string): Promise<void> {
    if (!refreshTokenValue) {
      return;
    }

    await this.userTokenRepository.deleteByValue(refreshTokenValue);
    this.loggerService.debug('Logout successful: refresh token invalidated');
  }
}
