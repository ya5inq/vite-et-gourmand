import { EntitySchema } from 'typeorm';

import { UserTokenInterface, UserTokenTypeEnum } from '@/domain/entities/userToken/userToken.entity.interface';

export const UserTokenSchema = new EntitySchema<UserTokenInterface>({
  name: 'user_token',
  columns: {
    id: {
      type: 'uuid',
      primary: true,
    },
    userId: {
      name: 'user_id',
      type: 'uuid',
      nullable: false,
    },
    value: {
      type: 'varchar',
      length: '255',
      nullable: false,
      unique: true,
    },
    canBeRefreshed: {
      name: 'can_be_refreshed',
      type: 'boolean',
      nullable: false,
    },
    tokenType: {
      name: 'token_type',
      type: 'varchar',
      length: '255',
      nullable: false,
      enum: UserTokenTypeEnum,
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
    expirationDate: {
      name: 'expiration_date',
      type: 'timestamp with time zone',
      nullable: false,
    },
  },
  relations: {
    user: {
      type: 'many-to-one',
      target: 'user',
      nullable: false,
      onDelete: 'CASCADE',
      joinColumn: {
        name: 'user_id',
        referencedColumnName: 'id',
      },
    },
  },
});
