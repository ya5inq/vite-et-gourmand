import { faker } from '@faker-js/faker';
import bcrypt from 'bcryptjs';

import { buildFactory } from '@/configuration/utils/buildFactory';

import { isAdminRole, RoleType, UserInterface } from './user.entity.interface';

const buildSchema = (): UserInterface => {
  const password = faker.internet.password();
  const hashedPassword = bcrypt.hashSync(password, 10);
  const role = faker.helpers.arrayElement([RoleType.USER, RoleType.EMPLOYEE, RoleType.ADMIN]);

  return {
    id: faker.string.uuid(),
    email: faker.internet.email().toLowerCase(),
    password: hashedPassword,
    role,
    admin: isAdminRole(role),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    phone: faker.phone.number(),
    address: faker.location.streetAddress(),
    city: faker.location.city(),
    postalCode: faker.location.zipCode(),
    isActive: true,
    emailVerified: faker.datatype.boolean(),
    lastLoginAt: faker.datatype.boolean() ? faker.date.recent() : null,
    preferredLanguage: 'fr',
    createdAt: faker.date.recent(),
    updatedAt: faker.date.recent(),
    userTokens: [],
  };
};

export const userFactory = (args?: Partial<UserInterface>): UserInterface => {
  const providedData: Partial<UserInterface> = {
    ...args,
  };

  if (args?.password) {
    providedData.password = bcrypt.hashSync(args.password, 10);
  }

  // Keep `admin` consistent with `role` when role is overridden but admin is not.
  if (args?.role !== undefined && args?.admin === undefined) {
    providedData.admin = isAdminRole(args.role);
  }

  return buildFactory<UserInterface>({
    ...buildSchema(),
  })({
    ...providedData,
  });
};
