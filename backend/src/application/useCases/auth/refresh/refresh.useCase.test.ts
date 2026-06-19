import { describe, beforeEach, expect, it, vi } from 'vitest';

import { UserTokenTypeEnum } from '@/domain/entities/userToken/userToken.entity.interface';

import { getEnvConfigMock } from '@/adapters/envConfig/envConfig.mock';
import { getLoggerMock } from '@/adapters/logger/logger.mock';
import { getUserRepositoryMock } from '@/adapters/repositories/userRepository/user.repository.mock';
import { getUserTokenRepositoryMock } from '@/adapters/repositories/userTokenRepository/userToken.repository.mock';
import { AppError } from '@/application/errors/app.error';
import { getAuthServiceMock } from '@/application/services/authToken/authToken.service.mock';
import { userFactory } from '@/domain/entities/user/user.factory';
import { userTokenFactory } from '@/domain/entities/userToken/userToken.entity.factory';

import { RefreshUseCase } from './refresh.useCase';

describe('RefreshUseCase', () => {
  const userRepositoryMock = getUserRepositoryMock();
  const userTokenRepositoryMock = getUserTokenRepositoryMock();
  const authServiceMock = getAuthServiceMock();
  const loggerServiceMock = getLoggerMock();
  const envConfigMock = getEnvConfigMock();
  const refreshUseCase = new RefreshUseCase(
    userRepositoryMock,
    userTokenRepositoryMock,
    authServiceMock,
    loggerServiceMock,
    envConfigMock,
  );

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should refresh from the cookie alone (no access token)', async () => {
    const user = userFactory();
    const oldRefreshToken = userTokenFactory({ tokenType: UserTokenTypeEnum.refreshToken, userId: user.id });
    const newAccessToken = 'new_access_token';

    userTokenRepositoryMock.findByTokenValue.mockResolvedValue(oldRefreshToken);
    userRepositoryMock.findById.mockResolvedValue(user);
    authServiceMock.verifyRefreshToken.mockReturnValue(oldRefreshToken);
    authServiceMock.generateAccessToken.mockResolvedValue(newAccessToken);

    const { accessToken, refreshToken } = await refreshUseCase.executeRefresh(oldRefreshToken.value);

    expect(accessToken).toBe(newAccessToken);
    expect(refreshToken).not.toBe(oldRefreshToken.value);
    // The user is resolved from the refresh token, not from an access token.
    expect(authServiceMock.verifyAccessToken).not.toHaveBeenCalled();
    expect(userRepositoryMock.findById).toHaveBeenCalledWith(user.id);
    expect(authServiceMock.verifyRefreshToken).toHaveBeenCalledWith({
      token: oldRefreshToken,
      tokenValue: oldRefreshToken.value,
      userId: user.id,
    });
    expect(authServiceMock.generateAccessToken).toHaveBeenCalledWith(user.id, user);
  });

  it('should validate the access token when provided', async () => {
    const user = userFactory();
    const oldRefreshToken = userTokenFactory({ tokenType: UserTokenTypeEnum.refreshToken, userId: user.id });
    const oldAccessToken = 'old_access_token';

    userTokenRepositoryMock.findByTokenValue.mockResolvedValue(oldRefreshToken);
    authServiceMock.verifyAccessToken.mockResolvedValue({ userId: user.id });
    userRepositoryMock.findById.mockResolvedValue(user);
    authServiceMock.verifyRefreshToken.mockReturnValue(oldRefreshToken);
    authServiceMock.generateAccessToken.mockResolvedValue('new_access_token');

    await refreshUseCase.executeRefresh(oldRefreshToken.value, oldAccessToken);

    expect(authServiceMock.verifyAccessToken).toHaveBeenCalledWith(oldAccessToken, true);
  });

  it('should throw when the access token user does not match the refresh token', async () => {
    const oldRefreshToken = userTokenFactory({ tokenType: UserTokenTypeEnum.refreshToken, userId: 'user-a' });

    userTokenRepositoryMock.findByTokenValue.mockResolvedValue(oldRefreshToken);
    authServiceMock.verifyAccessToken.mockResolvedValue({ userId: 'user-b' });

    await expect(refreshUseCase.executeRefresh(oldRefreshToken.value, 'mismatched_token')).rejects.toThrow(AppError);
  });

  it('should throw when the refresh token is unknown', async () => {
    userTokenRepositoryMock.findByTokenValue.mockResolvedValue(null);

    await expect(refreshUseCase.executeRefresh('unknown_token')).rejects.toThrow(AppError);
  });

  it('should throw an error if user not found', async () => {
    const oldRefreshToken = userTokenFactory({ tokenType: UserTokenTypeEnum.refreshToken, userId: 'non_existent_id' });

    userTokenRepositoryMock.findByTokenValue.mockResolvedValue(oldRefreshToken);
    userRepositoryMock.findById.mockResolvedValue(null);

    await expect(refreshUseCase.executeRefresh(oldRefreshToken.value)).rejects.toThrow(AppError);
  });
});
