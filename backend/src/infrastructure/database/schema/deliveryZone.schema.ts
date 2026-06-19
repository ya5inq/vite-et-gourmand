import { EntitySchema } from 'typeorm';

import { DeliveryZoneInterface } from '@/domain/entities/deliveryZone/deliveryZone.entity.interface';

import { decimalTransformer } from '@/infrastructure/utils/decimalTransformer';

export const DeliveryZoneSchema = new EntitySchema<DeliveryZoneInterface>({
  name: 'deliveryZone',
  tableName: 'delivery_zones',
  columns: {
    id: {
      type: 'uuid',
      primary: true,
      generated: 'uuid',
    },
    name: {
      type: 'varchar',
      length: '255',
      nullable: false,
    },
    postalCode: {
      name: 'postal_code',
      type: 'varchar',
      length: '20',
      nullable: true,
    },
    city: {
      type: 'varchar',
      length: '255',
      nullable: true,
    },
    distanceKm: {
      name: 'distance_km',
      type: 'numeric',
      precision: 6,
      scale: 2,
      nullable: false,
      default: 0,
      transformer: decimalTransformer,
    },
    isActive: {
      name: 'is_active',
      type: 'boolean',
      nullable: false,
      default: true,
    },
    createdAt: {
      name: 'created_at',
      type: 'timestamp with time zone',
      createDate: true,
    },
  },
  indices: [
    {
      name: 'idx_delivery_zone_is_active',
      columns: ['isActive'],
    },
  ],
});
