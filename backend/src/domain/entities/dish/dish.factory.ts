import { faker } from '@faker-js/faker';

import { buildFactory } from '@/configuration/utils/buildFactory';

import { DishCategory, DishInterface } from './dish.entity.interface';

const buildSchema = (): DishInterface => ({
  id: faker.string.uuid(),
  name: faker.commerce.productName(),
  description: faker.lorem.sentence(),
  category: faker.helpers.arrayElement([DishCategory.ENTREE, DishCategory.PLAT, DishCategory.DESSERT]),
  price: parseFloat(faker.commerce.price({ min: 8, max: 30 })),
  imageUrl: `/images/dishes/${faker.string.alpha(8)}.jpg`,
  isAvailable: true,
  createdAt: faker.date.recent(),
  updatedAt: faker.date.recent(),
  allergens: [],
});

export const dishFactory = (args?: Partial<DishInterface>): DishInterface =>
  buildFactory<DishInterface>(buildSchema())(args);
