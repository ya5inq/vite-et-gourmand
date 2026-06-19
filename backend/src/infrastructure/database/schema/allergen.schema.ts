import { EntitySchema } from 'typeorm';

import { AllergenInterface } from '@/domain/entities/allergen/allergen.entity.interface';

export const AllergenSchema = new EntitySchema<AllergenInterface>({
  name: 'allergen',
  tableName: 'allergens',
  columns: {
    id: {
      type: 'uuid',
      primary: true,
      generated: 'uuid',
    },
    name: {
      type: 'varchar',
      length: '255',
      unique: true,
      nullable: false,
    },
    icon: {
      type: 'varchar',
      length: '255',
      nullable: true,
    },
    createdAt: {
      name: 'created_at',
      type: 'timestamp with time zone',
      createDate: true,
    },
  },
});
