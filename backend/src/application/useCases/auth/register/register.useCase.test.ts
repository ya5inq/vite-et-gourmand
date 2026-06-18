/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { faker } from '@faker-js/faker';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { getEnvConfigMock } from '@/adapters/envConfig/envConfig.mock';
import { getLoggerMock } from '@/adapters/logger/logger.mock';
import { getMailSenderMock } from '@/adapters/mailSender/mailSender.mock';
import { getUserRepositoryMock } from '@/adapters/repositories/userRepository/user.repository.mock';
import { getUserTokenRepositoryMock } from '@/adapters/repositories/userTokenRepository/userToken.repository.mock';
import { AppError } from '@/application/errors/app.error';
import { getPasswordServiceMock } from '@/application/services/password/password.service.mock';
import { getUserTokenServiceMock } from '@/application/services/userToken/userToken.service.mock';
import { userFactory } from '@/domain/entities/user/user.factory';
import { userTokenFactory } from '@/domain/entities/userToken/userToken.entity.factory';

import { RegisterUseCase } from './register.useCase';

describe('RegisterUseCase', () => {
  const userRepositoryMock = getUserRepositoryMock();
  const userTokenRepositoryMock = getUserTokenRepositoryMock();
  const passwordServiceMock = getPasswordServiceMock();
  const userTokenServiceMock = getUserTokenServiceMock();
  const mailSenderMock = getMailSenderMock();
  const loggerMock = getLoggerMock();
  const envConfigMock = getEnvConfigMock();

  const registerUseCase = new RegisterUseCase(
    userRepositoryMock,
    userTokenRepositoryMock,
    passwordServiceMock,
    userTokenServiceMock,
    mailSenderMock,
    loggerMock,
    envConfigMock,
  );

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should register a user', async () => {
    const email = faker.internet.email().toUpperCase();
    const password = faker.internet.password();
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const phone = faker.phone.number();
    const address = faker.location.streetAddress();
    const city = faker.location.city();
    const postalCode = faker.location.zipCode();
    const hashedPassword = faker.string.alphanumeric();
    userRepositoryMock.findByEmail.mockResolvedValue(null);
    passwordServiceMock.checkPasswordComplexity.mockReturnValue(true);
    passwordServiceMock.hashPassword.mockResolvedValue(hashedPassword);
    userTokenServiceMock.generateToken.mockReturnValue(userTokenFactory());
    envConfigMock.accountTokenExpiration = 3600;

    await registerUseCase.executeRegister({
      email,
      password,
      firstName,
      lastName,
      phone,
      address,
      city,
      postalCode,
    });

    expect(userRepositoryMock.create).toHaveBeenCalledWith(
      expect.objectContaining({
        id: expect.any(String),
        email: email.toLowerCase(),
        password: hashedPassword,
        admin: false,
        role: 'USER',
        firstName,
        lastName,
        phone,
        address,
        city,
        postalCode,
        isActive: true,
        emailVerified: false,
        preferredLanguage: 'fr',
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        userTokens: [],
      }),
    );
    expect(mailSenderMock.sendRegisterEmail).toHaveBeenCalledWith({
      email: email.toLocaleLowerCase(),
      tokenValue: expect.any(String),
    });
    expect(userTokenRepositoryMock.create).toBeCalled();
  });
  it('should throw an error - email already exists', async () => {
    const email = faker.internet.email().toLocaleLowerCase();
    const password = faker.internet.password();
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const phone = faker.phone.number();
    userRepositoryMock.findByEmail.mockResolvedValue(userFactory());

    await expect(
      registerUseCase.executeRegister({
        email,
        password,
        firstName,
        lastName,
        phone,
        address: null,
        city: null,
        postalCode: null,
      }),
    ).rejects.toThrow(AppError);

    expect(userRepositoryMock.create).not.toBeCalled();
    expect(mailSenderMock.sendRegisterEmail).not.toBeCalled();
    expect(userTokenRepositoryMock.create).not.toBeCalled();
  });
  it('should throw an error - invalid password', async () => {
    const email = faker.internet.email().toLocaleLowerCase();
    const password = faker.internet.password();
    userRepositoryMock.findByEmail.mockResolvedValue(null);
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const phone = faker.phone.number();
    passwordServiceMock.checkPasswordComplexity.mockReturnValue(false);

    await expect(
      registerUseCase.executeRegister({
        email,
        password,
        firstName,
        lastName,
        phone,
        address: null,
        city: null,
        postalCode: null,
      }),
    ).rejects.toThrow(AppError);

    expect(userRepositoryMock.create).not.toBeCalled();
    expect(mailSenderMock.sendRegisterEmail).not.toBeCalled();
    expect(userTokenRepositoryMock.create).not.toBeCalled();
  });
});
