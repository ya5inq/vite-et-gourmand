import { faker } from '@faker-js/faker';

import { buildFactory } from '@/configuration/utils/buildFactory';

import { DeliveryZoneInterface } from './deliveryZone.entity.interface';

const buildSchema = (): DeliveryZoneInterface => ({
  id: faker.string.uuid(),
  name: faker.location.city(),
  postalCode: faker.location.zipCode('#####'),
  city: faker.location.city(),
  distanceKm: faker.number.float({ min: 0, max: 30, fractionDigits: 2 }),
  isActive: true,
  createdAt: faker.date.recent(),
});

export const deliveryZoneFactory = (args?: Partial<DeliveryZoneInterface>): DeliveryZoneInterface =>
  buildFactory<DeliveryZoneInterface>(buildSchema())(args);
