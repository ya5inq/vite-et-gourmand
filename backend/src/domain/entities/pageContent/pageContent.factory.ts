import { faker } from '@faker-js/faker';

import { buildFactory } from '@/configuration/utils/buildFactory';

import { PageContentInterface } from './pageContent.entity.interface';

const buildSchema = (): PageContentInterface => ({
  id: faker.string.uuid(),
  page: faker.helpers.arrayElement(['home', 'menus', 'contact', 'legal', 'footer']),
  section: faker.helpers.arrayElement(['hero', 'features', 'values', 'content']),
  content: { title: faker.lorem.words(2), description: faker.lorem.sentence() },
  updatedAt: faker.date.recent(),
  updatedBy: null,
});

export const pageContentFactory = (args?: Partial<PageContentInterface>): PageContentInterface =>
  buildFactory<PageContentInterface>(buildSchema())(args);
