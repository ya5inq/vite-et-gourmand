import { describe, it, expect } from 'vitest';

import { RoleType, UserInterface } from '@/domain/entities/user/user.entity.interface';

import { UserSerializer, PublicUser, PublicUserListItem } from './user.serializer';

describe('UserSerializer', () => {
  const mockUser: UserInterface = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    email: 'test@example.com',
    role: RoleType.USER,
    admin: false,
    firstName: 'John',
    lastName: 'Doe',
    phone: '+1234567890',
    address: '123 Main St',
    city: 'Paris',
    postalCode: '75001',
    isActive: true,
    emailVerified: true,
    preferredLanguage: 'fr',
    lastLoginAt: new Date('2023-01-02T12:00:00Z'),
    createdAt: new Date('2023-01-01T00:00:00Z'),
    updatedAt: new Date('2023-01-02T00:00:00Z'),
    password: 'password',
    userTokens: [],
  };

  describe('serialize', () => {
    it('should correctly serialize a valid user and omit the password', () => {
      const result = UserSerializer.serialize(mockUser);
      const expected: PublicUser = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        role: RoleType.USER,
        admin: false,
        phone: '+1234567890',
        address: '123 Main St',
        city: 'Paris',
        postalCode: '75001',
        isActive: true,
        emailVerified: true,
        preferredLanguage: 'fr',
        lastLoginAt: '2023-01-02T12:00:00.000Z',
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-02T00:00:00.000Z',
      };
      expect(result).toEqual(expected);
      expect(result).not.toHaveProperty('password');
    });

    it('should throw an error when serializing an invalid user', () => {
      const invalidUser = { ...mockUser, email: 'invalid-email' };
      expect(() => UserSerializer.serialize(invalidUser)).toThrow();
    });
  });

  describe('serializeForList', () => {
    it('should correctly serialize a user to a list item', () => {
      const result = UserSerializer.serializeForList(mockUser);
      const expected: PublicUserListItem = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        role: RoleType.USER,
        isActive: true,
        emailVerified: true,
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-02T00:00:00.000Z',
      };
      expect(result).toEqual(expected);
    });
  });
});
