import { hash } from 'bcryptjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { PasswordService } from './password.service';

describe('PasswordService', () => {
  const passwordService = new PasswordService();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('checkPasswordComplexity', () => {
    it('should return true if password is valid', () => {
      const password = 'Password123!';

      const isValid = passwordService.checkPasswordComplexity(password);

      expect(isValid).toBeTruthy();
    });
    it('should return false if password is invalid - less than 8 characters', () => {
      const password = 'Pass1!';

      const isValid = passwordService.checkPasswordComplexity(password);

      expect(isValid).toBeFalsy();
    });
    it('should return false if password is invalid - without uppercase letter', () => {
      const password = 'password123!';

      const isValid = passwordService.checkPasswordComplexity(password);

      expect(isValid).toBeFalsy();
    });
  });

  describe('hashPassword', () => {
    it('should return a hashed password', async () => {
      const clearPassword = 'password';

      const hashedPassword = await passwordService.hashPassword(clearPassword);

      expect(hashedPassword).toBeDefined();
    });
  });
  describe('comparePassword', () => {
    it('should return true if password is valid', async () => {
      const clearPassword = 'password';
      const hashedPassword = await hash(clearPassword, 10);

      const isValid = await passwordService.comparePassword(clearPassword, hashedPassword);

      expect(isValid).toBeTruthy();
    });
    it('should return false if password is invalid', async () => {
      const clearPassword = 'password';
      const invalidPassword = 'invalid-password';
      const hashedPassword = await hash(clearPassword, 10);

      const isValid = await passwordService.comparePassword(invalidPassword, hashedPassword);

      expect(isValid).toBeFalsy();
    });
  });

  describe('generateSecurePassword', () => {
    it('should return a non-empty URL-safe string of sufficient length', () => {
      const password = passwordService.generateSecurePassword(32);
      expect(password).toBeDefined();
      expect(password.length).toBeGreaterThanOrEqual(43);
      expect(password).not.toMatch(/[+/=]/);
    });

    it('should produce different passwords on subsequent calls', () => {
      const password1 = passwordService.generateSecurePassword();
      const password2 = passwordService.generateSecurePassword();
      expect(password1).not.toEqual(password2);
    });
  });
});
