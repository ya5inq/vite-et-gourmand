import { faker } from '@faker-js/faker';

import { buildFactory } from '@/configuration/utils/buildFactory';

import { DietaryRegimeInterface } from './dietaryRegime.entity.interface';

const buildSchema = (): DietaryRegimeInterface => ({
  id: faker.string.uuid(),
  name: faker.commerce.productAdjective(),
  description: faker.lorem.sentence(),
  createdAt: faker.date.recent(),
});

export const dietaryRegimeFactory = (args?: Partial<DietaryRegimeInterface>): DietaryRegimeInterface =>
  buildFactory<DietaryRegimeInterface>(buildSchema())(args);
