import { faker } from '@faker-js/faker';

import { buildFactory } from '@/configuration/utils/buildFactory';

import { OperatingHoursInterface } from './operatingHours.entity.interface';

const buildSchema = (): OperatingHoursInterface => ({
  id: faker.string.uuid(),
  dayOfWeek: faker.number.int({ min: 0, max: 6 }),
  openTime: '09:00',
  closeTime: '18:00',
  isClosed: false,
});

export const operatingHoursFactory = (args?: Partial<OperatingHoursInterface>): OperatingHoursInterface =>
  buildFactory<OperatingHoursInterface>(buildSchema())(args);
