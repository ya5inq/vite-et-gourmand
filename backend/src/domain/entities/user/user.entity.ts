import { RoleType, UserInterface } from './user.entity.interface';
import { UserToken } from '../userToken/userToken.entity';

export class User implements UserInterface {
  constructor(
    public id: string,
    public email: string,
    public password: string,
    public role: RoleType,
    public admin: boolean,
    public firstName: string,
    public lastName: string,
    public phone: string | null = null,
    public address: string | null = null,
    public city: string | null = null,
    public postalCode: string | null = null,
    public isActive: boolean,
    public emailVerified: boolean,
    public lastLoginAt: Date | null = null,
    public preferredLanguage: string = 'fr',
    public createdAt: Date,
    public updatedAt: Date,
    public userTokens: UserToken[],
  ) {}
}
