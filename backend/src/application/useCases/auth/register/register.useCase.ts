import { inject, injectable } from 'inversify';
import { v4 } from 'uuid';

import { AppErrorCodes } from '@/application/errors/app.error.interface';
import { PasswordServiceInterface } from '@/application/services/password/password.service.interface';
import { UserTokenServiceInterface } from '@/application/services/userToken/userToken.service.interface';
import { RoleType, UserInterface } from '@/domain/entities/user/user.entity.interface';
import { UserTokenTypeEnum } from '@/domain/entities/userToken/userToken.entity.interface';
import { EnvConfigInterface } from '@/domain/interfaces/adapters/envConfig.interface';
import { MailSenderInterface } from '@/domain/interfaces/adapters/mailSender.interface';
import { LoggerInterface } from '@/domain/interfaces/logger/logger.interface';
import { UserRepositoryInterface } from '@/domain/interfaces/repositories/user.repository.interface';
import { UserTokenRepositoryInterface } from '@/domain/interfaces/repositories/userToken.repository.interface';

import { AppError } from '@/application/errors/app.error';
import { TYPES } from '@/configuration/di/types';

import { RegisterInputInterface, RegisterUseCaseInterface } from './register.useCase.interface';

@injectable()
export class RegisterUseCase implements RegisterUseCaseInterface {
  constructor(
    @inject(TYPES.UserRepository) private userRepository: UserRepositoryInterface,
    @inject(TYPES.UserTokenRepository) private userTokenRepository: UserTokenRepositoryInterface,
    @inject(TYPES.PasswordService) private passwordService: PasswordServiceInterface,
    @inject(TYPES.UserTokenService) private userTokenService: UserTokenServiceInterface,
    @inject(TYPES.MailSender) private mailSender: MailSenderInterface,
    @inject(TYPES.Logger) private logger: LoggerInterface,
    @inject(TYPES.EnvConfig) private envConfig: EnvConfigInterface,
  ) {}
  async executeRegister(input: RegisterInputInterface): Promise<void> {
    const { email, password, firstName, lastName, phone, address, city, postalCode } = input;
    const lowerCaseEmail = email.toLowerCase();
    const alreadyExistUser = await this.userRepository.findByEmail(lowerCaseEmail);
    if (alreadyExistUser) {
      throw new AppError({
        code: AppErrorCodes.CONFLICT_EMAIL_TAKEN,
        message: 'Email already taken',
        privateContext: { email },
      });
    }

    const isPasswordValid = this.passwordService.checkPasswordComplexity(password);
    if (!isPasswordValid) {
      throw new AppError({
        code: AppErrorCodes.BAD_REQUEST_INVALID_PASSWORD_COMPLEXITY,
        message: 'Invalid password complexity',
      });
    }

    const hashedPassword = await this.passwordService.hashPassword(password);

    const user: UserInterface = {
      id: v4(),
      email: lowerCaseEmail,
      password: hashedPassword,
      role: RoleType.USER,
      admin: false,
      firstName,
      lastName,
      phone,
      address,
      city,
      postalCode,
      isActive: true,
      emailVerified: false,
      lastLoginAt: null,
      preferredLanguage: 'fr',
      createdAt: new Date(),
      updatedAt: new Date(),
      userTokens: [],
    };
    await this.userRepository.create(user);

    const validationToken = this.userTokenService.generateToken({
      canBeRefreshed: true,
      tokenType: UserTokenTypeEnum.accountValidation,
      userId: user.id,
      expiresIn: this.envConfig.accountTokenExpiration,
    });
    await this.userTokenRepository.create(validationToken);

    try {
      await this.mailSender.sendRegisterEmail({
        email: lowerCaseEmail,
        tokenValue: validationToken.value,
      });
    } catch (error) {
      this.logger.error('Error sending register email', { error });
    }
    this.logger.debug('User created', { email: lowerCaseEmail });
  }
}
