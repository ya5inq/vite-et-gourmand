import { EntitySchema } from 'typeorm';

import { OrderHistoryInterface } from '@/domain/entities/orderHistory/orderHistory.entity.interface';

import { ORDER_STATUS_VALUES } from '@/domain/entities/order/orderStatus';

export const OrderHistorySchema = new EntitySchema<OrderHistoryInterface>({
  name: 'orderHistory',
  tableName: 'order_history',
  columns: {
    id: {
      type: 'uuid',
      primary: true,
      generated: 'uuid',
    },
    orderId: {
      name: 'order_id',
      type: 'uuid',
      nullable: false,
    },
    oldStatus: {
      name: 'old_status',
      type: 'enum',
      enum: ORDER_STATUS_VALUES,
      enumName: 'order_status',
      nullable: true,
    },
    newStatus: {
      name: 'new_status',
      type: 'enum',
      enum: ORDER_STATUS_VALUES,
      enumName: 'order_status',
      nullable: false,
    },
    changedBy: {
      name: 'changed_by',
      type: 'uuid',
      nullable: true,
    },
    reason: {
      type: 'text',
      nullable: true,
    },
    contactMode: {
      name: 'contact_mode',
      type: 'varchar',
      length: '50',
      nullable: true,
    },
    createdAt: {
      name: 'created_at',
      type: 'timestamp with time zone',
      createDate: true,
    },
  },
  indices: [
    {
      name: 'idx_order_history_order_id',
      columns: ['orderId'],
    },
  ],
  relations: {
    order: {
      type: 'many-to-one',
      target: 'order',
      nullable: false,
      joinColumn: { name: 'order_id', referencedColumnName: 'id' },
      onDelete: 'CASCADE',
    },
    changedByUser: {
      type: 'many-to-one',
      target: 'user',
      nullable: true,
      joinColumn: { name: 'changed_by', referencedColumnName: 'id' },
      onDelete: 'SET NULL',
    },
  },
});
