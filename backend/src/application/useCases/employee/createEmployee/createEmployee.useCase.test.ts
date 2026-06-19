import { faker } from '@faker-js/faker';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { RoleType } from '@/domain/entities/user/user.entity.interface';

import { getAuditLogRepositoryMock } from '@/adapters/auditLog/auditLog.repository.mock';
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

import { CreateEmployeeUseCase } from './createEmployee.useCase';

describe('CreateEmployeeUseCase', () => {
  const userRepositoryMock = getUserRepositoryMock();
  const userTokenRepositoryMock = getUserTokenRepositoryMock();
  const passwordServiceMock = getPasswordServiceMock();
  const userTokenServiceMock = getUserTokenServiceMock();
  const mailSenderMock = getMailSenderMock();
  const auditLogRepositoryMock = getAuditLogRepositoryMock();
  const loggerMock = getLoggerMock();
  const envConfigMock = getEnvConfigMock();

  const createEmployeeUseCase = new CreateEmployeeUseCase(
    userRepositoryMock,
    userTokenRepositoryMock,
    passwordServiceMock,
    userTokenServiceMock,
    mailSenderMock,
    auditLogRepositoryMock,
    loggerMock,
    envConfigMock,
  );

  const baseInput = () => ({
    email: faker.internet.email().toUpperCase(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    phone: faker.phone.number(),
    actorId: faker.string.uuid(),
    actorRole: RoleType.ADMIN as string,
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should create an employee with role forced to EMPLOYEE and a random non-communicated password', async () => {
    const input = baseInput();
    const randomPassword = faker.internet.password();
    const hashedPassword = faker.string.alphanumeric();
    userRepositoryMock.findByEmail.mockResolvedValue(null);
    passwordServiceMock.generateSecurePassword.mockReturnValue(randomPassword);
    passwordServiceMock.hashPassword.mockResolvedValue(hashedPassword);
    userTokenServiceMock.generateToken.mockReturnValue(userTokenFactory());

    const result = await createEmployeeUseCase.executeCreateEmployee(input);

    // Random password is generated, hashed, and never returned to the caller.
    expect(passwordServiceMock.generateSecurePassword).toHaveBeenCalled();
    expect(passwordServiceMock.hashPassword).toHaveBeenCalledWith(randomPassword);
    expect(userRepositoryMock.create).toHaveBeenCalledWith(
      expect.objectContaining({
        id: expect.any(String),
        email: input.email.toLowerCase(),
        password: hashedPassword,
        role: RoleType.EMPLOYEE,
        admin: false,
        isActive: true,
        emailVerified: true,
      }),
    );
    expect(result.role).toBe(RoleType.EMPLOYEE);
    expect(result.admin).toBe(false);
  });

  it('should never create an admin even if an ADMIN role were somehow requested', async () => {
    const input = baseInput();
    userRepositoryMock.findByEmail.mockResolvedValue(null);
    passwordServiceMock.generateSecurePassword.mockReturnValue(faker.internet.password());
    passwordServiceMock.hashPassword.mockResolvedValue(faker.string.alphanumeric());
    userTokenServiceMock.generateToken.mockReturnValue(userTokenFactory());

    await createEmployeeUseCase.executeCreateEmployee(input);

    const createdUser = userRepositoryMock.create.mock.calls[0][0];
    expect(createdUser.role).toBe(RoleType.EMPLOYEE);
    expect(createdUser.admin).toBe(false);
  });

  it('should generate a set-password token and send the invite email', async () => {
    const input = baseInput();
    const token = userTokenFactory();
    userRepositoryMock.findByEmail.mockResolvedValue(null);
    passwordServiceMock.generateSecurePassword.mockReturnValue(faker.internet.password());
    passwordServiceMock.hashPassword.mockResolvedValue(faker.string.alphanumeric());
    userTokenServiceMock.generateToken.mockReturnValue(token);

    await createEmployeeUseCase.executeCreateEmployee(input);

    expect(userTokenRepositoryMock.create).toHaveBeenCalled();
    expect(mailSenderMock.sendEmployeeSetPasswordEmail).toHaveBeenCalledWith({
      email: input.email.toLowerCase(),
      tokenValue: token.value,
    });
    expect(auditLogRepositoryMock.record).toHaveBeenCalledWith(expect.objectContaining({ action: 'EMPLOYEE_CREATED' }));
  });

  it('should throw when the email is already taken', async () => {
    const input = baseInput();
    userRepositoryMock.findByEmail.mockResolvedValue(userFactory());

    await expect(createEmployeeUseCase.executeCreateEmployee(input)).rejects.toThrow(AppError);

    expect(userRepositoryMock.create).not.toHaveBeenCalled();
    expect(mailSenderMock.sendEmployeeSetPasswordEmail).not.toHaveBeenCalled();
    expect(userTokenRepositoryMock.create).not.toHaveBeenCalled();
  });
});
