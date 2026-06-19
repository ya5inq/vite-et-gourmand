import { faker } from '@faker-js/faker';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { UserTokenTypeEnum } from '@/domain/entities/userToken/userToken.entity.interface';

import { getLoggerMock } from '@/adapters/logger/logger.mock';
import { getUserRepositoryMock } from '@/adapters/repositories/userRepository/user.repository.mock';
import { getUserTokenRepositoryMock } from '@/adapters/repositories/userTokenRepository/userToken.repository.mock';
import { AppError } from '@/application/errors/app.error';
import { getPasswordServiceMock } from '@/application/services/password/password.service.mock';
import { getUserTokenServiceMock } from '@/application/services/userToken/userToken.service.mock';
import { userFactory } from '@/domain/entities/user/user.factory';
import { userTokenFactory } from '@/domain/entities/userToken/userToken.entity.factory';

import { SetEmployeePasswordUseCase } from './setEmployeePassword.useCase';

describe('SetEmployeePasswordUseCase', () => {
  const userTokenServiceMock = getUserTokenServiceMock();
  const userRepositoryMock = getUserRepositoryMock();
  const userTokenRepositoryMock = getUserTokenRepositoryMock();
  const passwordServiceMock = getPasswordServiceMock();
  const loggerMock = getLoggerMock();

  const setEmployeePasswordUseCase = new SetEmployeePasswordUseCase(
    userTokenServiceMock,
    userRepositoryMock,
    userTokenRepositoryMock,
    passwordServiceMock,
    loggerMock,
  );

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should set the employee password with a valid token', async () => {
    const tokenValue = faker.string.uuid();
    const newPassword = faker.internet.password();
    const hashedPassword = faker.string.alphanumeric();
    const user = userFactory();
    const token = userTokenFactory({ userId: user.id, tokenType: UserTokenTypeEnum.employeeSetPassword });

    userTokenRepositoryMock.findByTokenValue.mockResolvedValue(token);
    userTokenServiceMock.verifyToken.mockReturnValue(token);
    passwordServiceMock.checkPasswordComplexity.mockReturnValue(true);
    passwordServiceMock.hashPassword.mockResolvedValue(hashedPassword);
    userRepositoryMock.findById.mockResolvedValue(user);

    await setEmployeePasswordUseCase.executeSetEmployeePassword({ tokenValue, newPassword });

    expect(userRepositoryMock.updateOne).toHaveBeenCalledWith(
      user.id,
      expect.objectContaining({ password: hashedPassword, isActive: true }),
    );
    expect(userTokenRepositoryMock.deleteUserTokens).toHaveBeenCalledWith(
      user.id,
      expect.arrayContaining([UserTokenTypeEnum.employeeSetPassword]),
    );
  });

  it('should throw when the token is invalid (verifyToken throws)', async () => {
    const tokenValue = faker.string.uuid();
    userTokenRepositoryMock.findByTokenValue.mockResolvedValue(null);
    userTokenServiceMock.verifyToken.mockImplementation(() => {
      throw new AppError({ code: 'UNAUTHORIZED_TOKEN_NOT_FOUND', message: 'Token not found' });
    });

    await expect(
      setEmployeePasswordUseCase.executeSetEmployeePassword({ tokenValue, newPassword: faker.internet.password() }),
    ).rejects.toThrow(AppError);

    expect(userRepositoryMock.updateOne).not.toHaveBeenCalled();
  });

  it('should throw when the password complexity is invalid', async () => {
    const tokenValue = faker.string.uuid();
    const token = userTokenFactory({ tokenType: UserTokenTypeEnum.employeeSetPassword });
    userTokenRepositoryMock.findByTokenValue.mockResolvedValue(token);
    userTokenServiceMock.verifyToken.mockReturnValue(token);
    passwordServiceMock.checkPasswordComplexity.mockReturnValue(false);

    await expect(
      setEmployeePasswordUseCase.executeSetEmployeePassword({ tokenValue, newPassword: 'weak' }),
    ).rejects.toThrow(AppError);

    expect(userRepositoryMock.updateOne).not.toHaveBeenCalled();
  });
});
