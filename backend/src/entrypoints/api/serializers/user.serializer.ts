import { z } from 'zod';

import { UserInterface } from '@/domain/entities/user/user.entity.interface';

export const PublicUserSchemaParser = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
  role: z.enum(['USER', 'EMPLOYEE', 'ADMIN']),
  admin: z.boolean(),
  phone: z.string().nullable(),
  address: z.string().nullable(),
  city: z.string().nullable(),
  postalCode: z.string().nullable(),
  isActive: z.boolean(),
  emailVerified: z.boolean(),
  preferredLanguage: z.string(),
  lastLoginAt: z.string().datetime().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const PublicUserListItemSchemaParser = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
  role: z.enum(['USER', 'EMPLOYEE', 'ADMIN']),
  isActive: z.boolean(),
  emailVerified: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type PublicUser = z.infer<typeof PublicUserSchemaParser>;
export type PublicUserListItem = z.infer<typeof PublicUserListItemSchemaParser>;

export class UserSerializer {
  static serialize(user: UserInterface): PublicUser {
    return PublicUserSchemaParser.parse({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      admin: user.admin,
      phone: user.phone,
      address: user.address,
      city: user.city,
      postalCode: user.postalCode,
      isActive: user.isActive,
      emailVerified: user.emailVerified,
      preferredLanguage: user.preferredLanguage,
      lastLoginAt: user.lastLoginAt?.toISOString() ?? null,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    });
  }

  static serializeForList(user: UserInterface): PublicUserListItem {
    return PublicUserListItemSchemaParser.parse({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      isActive: user.isActive,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    });
  }
}
