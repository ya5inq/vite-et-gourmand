import { injectable } from 'inversify';
import { z } from 'zod';

import { EnvConfigInterface } from '@/domain/interfaces/adapters/envConfig.interface';

import { parseNumber, parseBoolean } from '@/configuration/utils/zodParser';

@injectable()
export class EnvConfig implements EnvConfigInterface {
  readonly nodeEnv: string;
  readonly port: number;
  readonly logLevel: string;

  // Database (Postgres)
  readonly autoMigration: boolean;
  readonly logSql: boolean;
  readonly dbUrl: string;
  readonly dbName: string;
  readonly dbUser: string;
  readonly dbPassword: string;

  // Database (Mongo)
  readonly mongoUrl: string;

  // JWT
  readonly accessTokenSecret: string;
  readonly accessTokenExpiration: number;
  readonly refreshTokenSecret: string;
  readonly refreshTokenExpiration: number;
  readonly accountTokenSecret: string;
  readonly accountTokenExpiration: number;
  readonly resetTokenSecret: string;
  readonly resetTokenExpiration: number;

  // Email
  readonly resendApiKey: string;
  readonly fromEmail: string;
  readonly contactEmail: string;

  // URLs
  readonly frontendUrl: string;

  constructor() {
    const config = this.buildConfig();
    this.nodeEnv = config.NODE_ENV;
    this.port = config.PORT;
    this.logLevel = config.LOG_LEVEL;

    // Database (Postgres)
    this.autoMigration = config.AUTO_MIGRATION;
    this.logSql = config.LOG_SQL;
    this.dbUrl = config.DATABASE_URL;
    this.dbName = config.DB_DATABASE;
    this.dbUser = config.DB_USERNAME;
    this.dbPassword = config.DB_PASSWORD;

    // Database (Mongo)
    this.mongoUrl = config.MONGO_URL;

    // JWT
    this.accessTokenSecret = config.ACCESS_TOKEN_SECRET;
    this.accessTokenExpiration = config.ACCESS_TOKEN_EXPIRATION;
    this.refreshTokenSecret = config.REFRESH_TOKEN_SECRET;
    this.refreshTokenExpiration = config.REFRESH_TOKEN_EXPIRATION;
    this.accountTokenSecret = config.ACCOUNT_TOKEN_SECRET;
    this.accountTokenExpiration = config.ACCOUNT_TOKEN_EXPIRATION;
    this.resetTokenSecret = config.RESET_TOKEN_SECRET;
    this.resetTokenExpiration = config.RESET_TOKEN_EXPIRATION;

    // Email
    this.resendApiKey = config.RESEND_API_KEY;
    this.fromEmail = config.FROM_EMAIL;
    this.contactEmail = config.CONTACT_EMAIL;

    // URLs
    this.frontendUrl = config.FRONTEND_URL;
  }

  private ConfigParser = z.object({
    NODE_ENV: z.string().default('development'),
    PORT: parseNumber(z.number()).default(8080),
    LOG_LEVEL: z.enum(['debug', 'info', 'warning', 'error']).default('info'),

    // Database (Postgres)
    LOG_SQL: parseBoolean(z.boolean()).default(false),
    AUTO_MIGRATION: parseBoolean(z.boolean()).default(false),
    DATABASE_URL: z.string(),
    DB_DATABASE: z.string().default('vite_et_gourmand'),
    DB_USERNAME: z.string().default('postgres'),
    DB_PASSWORD: z.string().default('pass'),

    // Database (Mongo) - placeholder for future phases
    MONGO_URL: z.string().default(''),

    // JWT
    ACCESS_TOKEN_SECRET: z.string(),
    ACCESS_TOKEN_EXPIRATION: parseNumber(z.number()).default(1800),
    REFRESH_TOKEN_SECRET: z.string(),
    REFRESH_TOKEN_EXPIRATION: parseNumber(z.number()).default(604800),
    ACCOUNT_TOKEN_SECRET: z.string(),
    ACCOUNT_TOKEN_EXPIRATION: parseNumber(z.number()).default(1800),
    RESET_TOKEN_SECRET: z.string(),
    RESET_TOKEN_EXPIRATION: parseNumber(z.number()).default(1800),

    // Email - placeholder for future phases
    RESEND_API_KEY: z.string().default(''),
    FROM_EMAIL: z.string().default('no-reply@vite-et-gourmand.com'),
    CONTACT_EMAIL: z.string().default('contact@vite-et-gourmand.com'),

    // URLs
    FRONTEND_URL: z.string().default('http://localhost:3000'),
  });

  /**
   * Build and validate environment configuration
   *
   * ⚠️ EXCEPTION: Uses console.error instead of Logger
   * Reason: EnvConfig is required by Logger, so Logger doesn't exist yet
   * when EnvConfig is instantiated (chicken-egg problem).
   * This is an acceptable exception for critical bootstrap errors.
   */
  private buildConfig() {
    try {
      return this.ConfigParser.parse(process.env);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('❌ CRITICAL: Error while parsing environment variables');
      if (error instanceof z.ZodError) {
        // eslint-disable-next-line no-console
        console.error('Missing or invalid environment variables:');
        error.errors.forEach((err) => {
          // eslint-disable-next-line no-console
          console.error(`  - ${err.path.join('.')}: ${err.message}`);
        });
      } else if (error instanceof Error) {
        // eslint-disable-next-line no-console
        console.error(error.message);
      }
      // eslint-disable-next-line no-console
      console.error('💡 Please check your .env file configuration');
      throw error; // Fail fast - app cannot start without valid config
    }
  }
}
