import { faker } from '@faker-js/faker';

import { buildFactory } from '@/configuration/utils/buildFactory';

import { AllergenInterface } from './allergen.entity.interface';

const buildSchema = (): AllergenInterface => ({
  id: faker.string.uuid(),
  name: faker.commerce.productMaterial(),
  icon: faker.helpers.arrayElement(['wheat', 'milk', 'egg', null]),
  createdAt: faker.date.recent(),
});

export const allergenFactory = (args?: Partial<AllergenInterface>): AllergenInterface =>
  buildFactory<AllergenInterface>(buildSchema())(args);
