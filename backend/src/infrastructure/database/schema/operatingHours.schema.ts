import { EntitySchema } from 'typeorm';

import { OperatingHoursInterface } from '@/domain/entities/operatingHours/operatingHours.entity.interface';

export const OperatingHoursSchema = new EntitySchema<OperatingHoursInterface>({
  name: 'operatingHours',
  tableName: 'operating_hours',
  columns: {
    id: {
      type: 'uuid',
      primary: true,
      generated: 'uuid',
    },
    dayOfWeek: {
      name: 'day_of_week',
      type: 'int',
      nullable: false,
      unique: true,
    },
    openTime: {
      name: 'open_time',
      type: 'time',
      nullable: true,
    },
    closeTime: {
      name: 'close_time',
      type: 'time',
      nullable: true,
    },
    isClosed: {
      name: 'is_closed',
      type: 'boolean',
      nullable: false,
      default: false,
    },
  },
  checks: [{ name: 'chk_operating_hours_day', expression: '"day_of_week" >= 0 AND "day_of_week" <= 6' }],
});
