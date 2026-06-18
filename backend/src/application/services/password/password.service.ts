import { randomBytes } from 'crypto';

import { hash, compare } from 'bcryptjs';
import { injectable } from 'inversify';

import { PasswordServiceInterface } from './password.service.interface';

export const PASSWORD_SERVICE_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\d\W_])[a-zA-Z\d\W_]{8,}$/;

@injectable()
export class PasswordService implements PasswordServiceInterface {
  checkPasswordComplexity(password: string): boolean {
    return PASSWORD_SERVICE_REGEX.test(password);
  }

  async hashPassword(password: string): Promise<string> {
    return await hash(password, 10);
  }
  async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return await compare(password, hashedPassword);
  }

  generateSecurePassword(length = 32): string {
    return randomBytes(length).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
  }
}
