import { EntitySchema } from 'typeorm';

import { OrderInterface } from '@/domain/entities/order/order.entity.interface';

import { ORDER_STATUS_VALUES, OrderStatusEnum } from '@/domain/entities/order/orderStatus';
import { decimalTransformer } from '@/infrastructure/utils/decimalTransformer';

export const OrderSchema = new EntitySchema<OrderInterface>({
  name: 'order',
  tableName: 'orders',
  columns: {
    id: {
      type: 'uuid',
      primary: true,
      generated: 'uuid',
    },
    userId: {
      name: 'user_id',
      type: 'uuid',
      nullable: true,
    },
    status: {
      type: 'enum',
      enum: ORDER_STATUS_VALUES,
      enumName: 'order_status',
      nullable: false,
      default: OrderStatusEnum.PENDING,
    },
    guestEmail: {
      name: 'guest_email',
      type: 'varchar',
      length: '255',
      nullable: true,
    },
    guestName: {
      name: 'guest_name',
      type: 'varchar',
      length: '255',
      nullable: true,
    },
    guestPhone: {
      name: 'guest_phone',
      type: 'varchar',
      length: '50',
      nullable: true,
    },
    deliveryAddress: {
      name: 'delivery_address',
      type: 'varchar',
      length: '255',
      nullable: true,
    },
    deliveryCity: {
      name: 'delivery_city',
      type: 'varchar',
      length: '255',
      nullable: true,
    },
    deliveryPostalCode: {
      name: 'delivery_postal_code',
      type: 'varchar',
      length: '20',
      nullable: true,
    },
    deliveryZoneId: {
      name: 'delivery_zone_id',
      type: 'uuid',
      nullable: true,
    },
    deliveryDate: {
      name: 'delivery_date',
      type: 'date',
      nullable: true,
    },
    deliveryFee: {
      name: 'delivery_fee',
      type: 'numeric',
      precision: 10,
      scale: 2,
      nullable: false,
      default: 0,
      transformer: decimalTransformer,
    },
    totalPrice: {
      name: 'total_price',
      type: 'numeric',
      precision: 10,
      scale: 2,
      nullable: false,
      transformer: decimalTransformer,
    },
    notes: {
      type: 'text',
      nullable: true,
    },
    rejectionReason: {
      name: 'rejection_reason',
      type: 'text',
      nullable: true,
    },
    rejectedBy: {
      name: 'rejected_by',
      type: 'uuid',
      nullable: true,
    },
    rejectedAt: {
      name: 'rejected_at',
      type: 'timestamp with time zone',
      nullable: true,
    },
    materialReturnDeadline: {
      name: 'material_return_deadline',
      type: 'timestamp with time zone',
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
      name: 'idx_order_user_id',
      columns: ['userId'],
    },
    {
      name: 'idx_order_status',
      columns: ['status'],
    },
  ],
  relations: {
    user: {
      type: 'many-to-one',
      target: 'user',
      nullable: true,
      joinColumn: { name: 'user_id', referencedColumnName: 'id' },
      onDelete: 'SET NULL',
    },
    deliveryZone: {
      type: 'many-to-one',
      target: 'deliveryZone',
      nullable: true,
      joinColumn: { name: 'delivery_zone_id', referencedColumnName: 'id' },
      onDelete: 'SET NULL',
    },
    orderItems: {
      type: 'one-to-many',
      target: 'orderItem',
      inverseSide: 'order',
      cascade: true,
    },
  },
});
