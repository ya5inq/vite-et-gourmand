import { EntitySchema } from 'typeorm';

import { DietaryRegimeInterface } from '@/domain/entities/dietaryRegime/dietaryRegime.entity.interface';

export const DietaryRegimeSchema = new EntitySchema<DietaryRegimeInterface>({
  name: 'dietary_regime',
  tableName: 'dietary_regimes',
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
    description: {
      type: 'text',
      nullable: true,
    },
    createdAt: {
      name: 'created_at',
      type: 'timestamp with time zone',
      createDate: true,
    },
  },
});
