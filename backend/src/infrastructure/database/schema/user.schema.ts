import { EntitySchema } from 'typeorm';

import { RoleType, UserInterface } from '@/domain/entities/user/user.entity.interface';

export const UserSchema = new EntitySchema<UserInterface>({
  name: 'user',
  columns: {
    id: {
      type: 'uuid',
      primary: true,
    },
    email: {
      type: 'varchar',
      length: '255',
      unique: true,
      nullable: false,
    },
    password: {
      type: 'varchar',
      length: '255',
      nullable: false,
    },
    role: {
      type: 'enum',
      enum: RoleType,
      nullable: false,
      default: RoleType.USER,
    },
    admin: {
      type: 'boolean',
      nullable: false,
      default: false,
    },
    firstName: {
      name: 'first_name',
      type: 'varchar',
      nullable: false,
    },
    lastName: {
      name: 'last_name',
      type: 'varchar',
      nullable: false,
    },
    phone: {
      type: 'varchar',
      nullable: true,
    },
    address: {
      type: 'varchar',
      nullable: true,
    },
    city: {
      type: 'varchar',
      nullable: true,
    },
    postalCode: {
      name: 'postal_code',
      type: 'varchar',
      nullable: true,
    },
    isActive: {
      name: 'is_active',
      type: 'boolean',
      nullable: false,
      default: true,
    },
    emailVerified: {
      name: 'email_verified',
      type: 'boolean',
      nullable: false,
      default: false,
    },
    lastLoginAt: {
      name: 'last_login_at',
      type: 'timestamp with time zone',
      nullable: true,
    },
    preferredLanguage: {
      name: 'preferred_language',
      type: 'varchar',
      nullable: false,
      default: 'fr',
    },
    createdAt: {
      name: 'created_at',
      type: 'timestamp with time zone',
      createDate: true,
    },
    updatedAt: {
      name: 'updated_at',
      type: 'timestamp with time zone',
      updateDate: true,
    },
  },
  relations: {
    userTokens: {
      type: 'one-to-many',
      target: 'user_token',
      nullable: false,
      inverseSide: 'user',
      cascade: true,
    },
  },
});
