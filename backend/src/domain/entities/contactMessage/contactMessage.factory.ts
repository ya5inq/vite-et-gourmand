import { faker } from '@faker-js/faker';

import { buildFactory } from '@/configuration/utils/buildFactory';

import { ContactMessageInterface } from './contactMessage.entity.interface';

const buildSchema = (): ContactMessageInterface => ({
  id: faker.string.uuid(),
  name: faker.person.fullName(),
  email: faker.internet.email(),
  phone: faker.helpers.arrayElement([faker.phone.number(), null]),
  subject: faker.helpers.arrayElement([faker.lorem.words(3), null]),
  message: faker.lorem.paragraph(),
  isRead: false,
  createdAt: faker.date.recent(),
});

export const contactMessageFactory = (args?: Partial<ContactMessageInterface>): ContactMessageInterface =>
  buildFactory<ContactMessageInterface>(buildSchema())(args);
