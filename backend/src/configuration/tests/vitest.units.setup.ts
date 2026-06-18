import 'reflect-metadata';

/**
 * Provide safe default env vars for unit tests.
 * Some code paths (e.g. AppError -> Logger -> EnvConfig) instantiate EnvConfig,
 * which validates process.env. These defaults keep that validation happy without
 * relying on a real .env file.
 */
const TEST_ENV_DEFAULTS: Record<string, string> = {
  NODE_ENV: 'test',
  DATABASE_URL: 'postgres://postgres:pass@localhost:5432/vite_et_gourmand_test',
  ACCESS_TOKEN_SECRET: 'testAccessTokenSecret',
  REFRESH_TOKEN_SECRET: 'testRefreshTokenSecret',
  ACCOUNT_TOKEN_SECRET: 'testAccountTokenSecret',
  RESET_TOKEN_SECRET: 'testResetTokenSecret',
};

for (const [key, value] of Object.entries(TEST_ENV_DEFAULTS)) {
  if (!process.env[key]) {
    process.env[key] = value;
  }
}
