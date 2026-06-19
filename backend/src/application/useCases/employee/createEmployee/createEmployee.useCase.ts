import { inject, injectable } from 'inversify';
import { v4 } from 'uuid';

import { AppErrorCodes } from '@/application/errors/app.error.interface';
import { PasswordServiceInterface } from '@/application/services/password/password.service.interface';
import { UserTokenServiceInterface } from '@/application/services/userToken/userToken.service.interface';
import { RoleType, UserInterface } from '@/domain/entities/user/user.entity.interface';
import { UserTokenTypeEnum } from '@/domain/entities/userToken/userToken.entity.interface';
import { AuditLogRepositoryInterface } from '@/domain/interfaces/adapters/auditLog.repository.interface';
import { EnvConfigInterface } from '@/domain/interfaces/adapters/envConfig.interface';
import { MailSenderInterface } from '@/domain/interfaces/adapters/mailSender.interface';
import { LoggerInterface } from '@/domain/interfaces/logger/logger.interface';
import { UserRepositoryInterface } from '@/domain/interfaces/repositories/user.repository.interface';
import { UserTokenRepositoryInterface } from '@/domain/interfaces/repositories/userToken.repository.interface';

import { AppError } from '@/application/errors/app.error';
import { TYPES } from '@/configuration/di/types';

import { CreateEmployeeInputInterface, CreateEmployeeUseCaseInterface } from './createEmployee.useCase.interface';

@injectable()
export class CreateEmployeeUseCase implements CreateEmployeeUseCaseInterface {
  constructor(
    @inject(TYPES.UserRepository) private userRepository: UserRepositoryInterface,
    @inject(TYPES.UserTokenRepository) private userTokenRepository: UserTokenRepositoryInterface,
    @inject(TYPES.PasswordService) private passwordService: PasswordServiceInterface,
    @inject(TYPES.UserTokenService) private userTokenService: UserTokenServiceInterface,
    @inject(TYPES.MailSender) private mailSender: MailSenderInterface,
    @inject(TYPES.AuditLogRepository) private auditLogRepository: AuditLogRepositoryInterface,
    @inject(TYPES.Logger) private logger: LoggerInterface,
    @inject(TYPES.EnvConfig) private envConfig: EnvConfigInterface,
  ) {}

  async executeCreateEmployee(input: CreateEmployeeInputInterface): Promise<UserInterface> {
    const { email, firstName, lastName, phone, actorId, actorRole } = input;
    const lowerCaseEmail = email.toLowerCase();

    const alreadyExistUser = await this.userRepository.findByEmail(lowerCaseEmail);
    if (alreadyExistUser) {
      throw new AppError({
        code: AppErrorCodes.CONFLICT_EMAIL_TAKEN,
        message: 'Email already taken',
        privateContext: { email: lowerCaseEmail },
      });
    }

    // The account is created by an admin. A random password is generated and
    // never communicated: the employee defines their own password via the
    // invite link sent below.
    const randomPassword = this.passwordService.generateSecurePassword();
    const hashedPassword = await this.passwordService.hashPassword(randomPassword);

    // The role is FORCED to EMPLOYEE — an admin account can never be created
    // through this use case (José's requirement).
    const user: UserInterface = {
      id: v4(),
      email: lowerCaseEmail,
      password: hashedPassword,
      role: RoleType.EMPLOYEE,
      admin: false,
      firstName,
      lastName,
      phone,
      address: null,
      city: null,
      postalCode: null,
      isActive: true,
      emailVerified: true,
      lastLoginAt: null,
      preferredLanguage: 'fr',
      createdAt: new Date(),
      updatedAt: new Date(),
      userTokens: [],
    };
    await this.userRepository.create(user);

    const setPasswordToken = this.userTokenService.generateToken({
      userId: user.id,
      tokenType: UserTokenTypeEnum.employeeSetPassword,
      canBeRefreshed: false,
      expiresIn: this.envConfig.employeeSetPasswordTokenExpiration,
    });
    await this.userTokenRepository.create(setPasswordToken);

    try {
      await this.mailSender.sendEmployeeSetPasswordEmail({
        email: lowerCaseEmail,
        tokenValue: setPasswordToken.value,
      });
    } catch (error) {
      this.logger.error('Error sending employee set-password email', { error });
    }

    await this.auditLogRepository.record({
      entityType: 'user',
      entityId: user.id,
      action: 'EMPLOYEE_CREATED',
      actorId,
      actorRole,
    });

    this.logger.debug('Employee created', { email: lowerCaseEmail });

    return user;
  }
}
