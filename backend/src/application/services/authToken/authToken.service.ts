import { inject, injectable } from 'inversify';
import { z } from 'zod';

import { AppErrorCodes } from '@/application/errors/app.error.interface';
import { RoleType, UserInterface } from '@/domain/entities/user/user.entity.interface';
import { UserTokenInterface, UserTokenTypeEnum } from '@/domain/entities/userToken/userToken.entity.interface';
import { EnvConfigInterface } from '@/domain/interfaces/adapters/envConfig.interface';

import { AppError } from '@/application/errors/app.error';
import { TYPES } from '@/configuration/di/types';

import { AuthServiceInterface, UserPayloadOptions, VerifyRefreshTokenOptions } from './authToken.service.interface';
import { StatelessTokenServiceInterface } from '../statelessToken/statelessToken.service.interface';
import { UserTokenServiceInterface } from '../userToken/userToken.service.interface';

const UserPayloadOptionsSchema = z.object({
  userId: z.string(),
  email: z.string().optional(),
  admin: z.boolean().optional(),
  role: z.nativeEnum(RoleType).optional(),
});

@injectable()
export class AuthService implements AuthServiceInterface {
  constructor(
    @inject(TYPES.StatelessTokenService)
    private statelessTokenService: StatelessTokenServiceInterface,
    @inject(TYPES.UserTokenService)
    private userTokenService: UserTokenServiceInterface,
    @inject(TYPES.EnvConfig)
    private envConfig: EnvConfigInterface,
  ) {}

  generateAccessToken(userId: string, user: UserInterface): Promise<string> {
    return this.statelessTokenService.generateToken({
      payload: {
        userId,
        email: user.email,
        admin: user.admin,
        role: user.role,
      },
      expiresIn: this.envConfig.accessTokenExpiration,
      secret: this.envConfig.accessTokenSecret,
    });
  }
  generateRefreshToken(userId: string): UserTokenInterface {
    return this.userTokenService.generateToken({
      userId,
      canBeRefreshed: true,
      expiresIn: this.envConfig.refreshTokenExpiration,
      tokenType: UserTokenTypeEnum.refreshToken,
    });
  }
  async verifyAccessToken(token: string, ignoreExpiration = false): Promise<UserPayloadOptions> {
    const payload = await this.statelessTokenService.verifyToken({
      token,
      secret: this.envConfig.accessTokenSecret,
      ignoreExpiration,
    });

    const parseResult = UserPayloadOptionsSchema.safeParse(payload);

    if (!parseResult.success) {
      throw new AppError({
        message: 'Invalid jwt token',
        code: AppErrorCodes.UNAUTHORIZED_INVALID_JWT,
        privateContext: {
          message: 'Payload have invalid format',
          payload,
          token,
        },
      });
    }

    return parseResult.data;
  }
  verifyRefreshToken({ token, tokenValue, userId }: VerifyRefreshTokenOptions): UserTokenInterface {
    return this.userTokenService.verifyToken({
      token,
      tokenValue,
      tokenType: UserTokenTypeEnum.refreshToken,
      userId,
    });
  }
}
