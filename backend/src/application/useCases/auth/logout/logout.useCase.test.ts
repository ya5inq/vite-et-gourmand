import { describe, beforeEach, expect, it, vi } from 'vitest';

import { getLoggerMock } from '@/adapters/logger/logger.mock';
import { getUserTokenRepositoryMock } from '@/adapters/repositories/userTokenRepository/userToken.repository.mock';

import { LogoutUseCase } from './logout.useCase';

describe('LogoutUseCase', () => {
  const userTokenRepository = getUserTokenRepositoryMock();
  const loggerService = getLoggerMock();
  const logoutUseCase = new LogoutUseCase(userTokenRepository, loggerService);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should delete the refresh token by value', async () => {
    await logoutUseCase.executeLogout('refresh-token-value');

    expect(userTokenRepository.deleteByValue).toHaveBeenCalledWith('refresh-token-value');
  });

  it('should do nothing if no refresh token is provided', async () => {
    await logoutUseCase.executeLogout(undefined);

    expect(userTokenRepository.deleteByValue).not.toHaveBeenCalled();
  });
});
