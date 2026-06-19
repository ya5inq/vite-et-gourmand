import { faker } from '@faker-js/faker';

import { buildFactory } from '@/configuration/utils/buildFactory';

import { ReviewInterface } from './review.entity.interface';

const buildSchema = (): ReviewInterface => ({
  id: faker.string.uuid(),
  userId: faker.string.uuid(),
  orderId: faker.string.uuid(),
  rating: faker.number.int({ min: 1, max: 5 }),
  comment: faker.helpers.arrayElement([faker.lorem.sentence(), null]),
  isApproved: false,
  approvedBy: null,
  createdAt: faker.date.recent(),
  updatedAt: faker.date.recent(),
  user: null,
  order: null,
});

export const reviewFactory = (args?: Partial<ReviewInterface>): ReviewInterface =>
  buildFactory<ReviewInterface>(buildSchema())(args);
