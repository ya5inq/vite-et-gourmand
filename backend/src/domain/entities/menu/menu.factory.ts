import { faker } from '@faker-js/faker';

import { buildFactory } from '@/configuration/utils/buildFactory';

import { MenuInterface } from './menu.entity.interface';

const buildSchema = (): MenuInterface => ({
  id: faker.string.uuid(),
  name: faker.commerce.productName(),
  description: faker.lorem.paragraph(),
  theme: faker.commerce.department(),
  price: parseFloat(faker.commerce.price({ min: 35, max: 90 })),
  minPersons: faker.number.int({ min: 8, max: 20 }),
  maxPersons: faker.number.int({ min: 50, max: 200 }),
  stock: null,
  conditions: faker.lorem.sentence(),
  imageUrl: `/images/menus/${faker.string.alpha(8)}.jpg`,
  isAvailable: true,
  createdAt: faker.date.recent(),
  updatedAt: faker.date.recent(),
  dishes: [],
  dietaryRegimes: [],
});

export const menuFactory = (args?: Partial<MenuInterface>): MenuInterface =>
  buildFactory<MenuInterface>(buildSchema())(args);
