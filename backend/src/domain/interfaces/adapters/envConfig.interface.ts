export interface EnvConfigInterface {
  nodeEnv: string;
  port: number;
  logLevel: string;

  // Database (Postgres)
  autoMigration: boolean;
  logSql: boolean;
  dbUrl: string;
  dbName: string;
  dbUser: string;
  dbPassword: string;

  // Database (Mongo) - placeholder for future phases
  mongoUrl: string;

  // JWT
  accessTokenSecret: string;
  accessTokenExpiration: number;
  refreshTokenSecret: string;
  refreshTokenExpiration: number;
  accountTokenSecret: string;
  accountTokenExpiration: number;
  resetTokenSecret: string;
  resetTokenExpiration: number;
  employeeSetPasswordTokenExpiration: number;

  // Email
  resendApiKey: string;
  fromEmail: string;
  contactEmail: string;

  // URLs
  frontendUrl: string;
  backOfficeUrl: string;
}
