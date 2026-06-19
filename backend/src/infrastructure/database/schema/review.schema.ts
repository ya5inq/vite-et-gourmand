import { EntitySchema } from 'typeorm';

import { ReviewInterface } from '@/domain/entities/review/review.entity.interface';

export const ReviewSchema = new EntitySchema<ReviewInterface>({
  name: 'review',
  tableName: 'reviews',
  columns: {
    id: {
      type: 'uuid',
      primary: true,
      generated: 'uuid',
    },
    userId: {
      name: 'user_id',
      type: 'uuid',
      nullable: false,
    },
    orderId: {
      name: 'order_id',
      type: 'uuid',
      nullable: false,
      unique: true,
    },
    rating: {
      type: 'int',
      nullable: false,
    },
    comment: {
      type: 'text',
      nullable: true,
    },
    isApproved: {
      name: 'is_approved',
      type: 'boolean',
      nullable: false,
      default: false,
    },
    approvedBy: {
      name: 'approved_by',
      type: 'uuid',
      nullable: true,
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
  indices: [
    {
      name: 'idx_review_is_approved',
      columns: ['isApproved'],
    },
  ],
  checks: [{ name: 'chk_review_rating', expression: '"rating" >= 1 AND "rating" <= 5' }],
  relations: {
    user: {
      type: 'many-to-one',
      target: 'user',
      nullable: false,
      joinColumn: { name: 'user_id', referencedColumnName: 'id' },
      onDelete: 'CASCADE',
    },
    order: {
      type: 'many-to-one',
      target: 'order',
      nullable: false,
      joinColumn: { name: 'order_id', referencedColumnName: 'id' },
      onDelete: 'CASCADE',
    },
  },
});
