import { faker } from '@faker-js/faker';
import { Mocked } from 'vitest';

import { EnvConfigInterface } from '@/domain/interfaces/adapters/envConfig.interface';

export const getEnvConfigMock = (): Mocked<EnvConfigInterface> => {
  const dbUser = faker.internet.userName();
  const dbPassword = faker.internet.password();
  const dbHost = faker.internet.ip();
  const dbPort = faker.number.int({ min: 1, max: 65535 });
  const dbName = 'postgres';
  const dbUrl = `postgres://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}`;

  return {
    nodeEnv: faker.helpers.arrayElement(['development', 'production', 'test']),
    port: faker.internet.port(),
    logLevel: faker.helpers.arrayElement(['debug', 'info', 'warning', 'error']),

    // Database (Postgres)
    autoMigration: faker.datatype.boolean(),
    logSql: faker.datatype.boolean(),
    dbUrl,
    dbName,
    dbUser,
    dbPassword,

    // Database (Mongo)
    mongoUrl: `mongodb://${dbUser}:${dbPassword}@${dbHost}:27017/${dbName}?authSource=admin`,

    // JWT
    accessTokenSecret: faker.string.alphanumeric(32),
    accessTokenExpiration: faker.number.int({ min: 300, max: 3600 }),
    refreshTokenSecret: faker.string.alphanumeric(32),
    refreshTokenExpiration: faker.number.int({ min: 86400, max: 604800 }),
    accountTokenSecret: faker.string.alphanumeric(32),
    accountTokenExpiration: faker.number.int({ min: 300, max: 3600 }),
    resetTokenSecret: faker.string.alphanumeric(32),
    resetTokenExpiration: faker.number.int({ min: 300, max: 3600 }),

    // Email
    resendApiKey: faker.string.alphanumeric(32),
    fromEmail: faker.internet.email(),
    contactEmail: faker.internet.email(),

    // URLs
    frontendUrl: faker.internet.url(),
    backOfficeUrl: faker.internet.url(),
  };
};
