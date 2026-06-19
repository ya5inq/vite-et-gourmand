import { EntitySchema } from 'typeorm';

import { OrderItemInterface } from '@/domain/entities/orderItem/orderItem.entity.interface';

import { decimalTransformer } from '@/infrastructure/utils/decimalTransformer';

export const OrderItemSchema = new EntitySchema<OrderItemInterface>({
  name: 'orderItem',
  tableName: 'order_items',
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
    menuId: {
      name: 'menu_id',
      type: 'uuid',
      nullable: false,
    },
    quantity: {
      type: 'int',
      nullable: false,
      default: 1,
    },
    unitPrice: {
      name: 'unit_price',
      type: 'numeric',
      precision: 10,
      scale: 2,
      nullable: false,
      transformer: decimalTransformer,
    },
    lineTotal: {
      name: 'line_total',
      type: 'numeric',
      precision: 10,
      scale: 2,
      nullable: false,
      transformer: decimalTransformer,
    },
    discountApplied: {
      name: 'discount_applied',
      type: 'boolean',
      nullable: false,
      default: false,
    },
    createdAt: {
      name: 'created_at',
      type: 'timestamp with time zone',
      createDate: true,
    },
  },
  indices: [
    {
      name: 'idx_order_item_order_id',
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
    menu: {
      type: 'many-to-one',
      target: 'menu',
      nullable: false,
      joinColumn: { name: 'menu_id', referencedColumnName: 'id' },
      onDelete: 'RESTRICT',
    },
  },
});
