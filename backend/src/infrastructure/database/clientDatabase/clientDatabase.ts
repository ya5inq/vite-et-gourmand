import { inject, injectable } from 'inversify';
import { DataSource } from 'typeorm';

import { EnvConfigInterface } from '@/domain/interfaces/adapters/envConfig.interface';
import { LoggerInterface } from '@/domain/interfaces/logger/logger.interface';

import { TYPES } from '@/configuration/di/types';

import { ClientDatabaseInterface } from './clientDatabase.interface';
import { CustomNamingStrategy } from './customNamingStrategy';
// eslint-disable-next-line import/namespace
import * as migrations from '../migrations';
// eslint-disable-next-line import/namespace
import * as schemas from '../schema';
import { TypeOrmDatabase } from '../typeorm/typeormDatabase';

@injectable()
export class ClientDatabase implements ClientDatabaseInterface {
  private db: TypeOrmDatabase;

  constructor(@inject(TYPES.EnvConfig) envConfig: EnvConfigInterface, @inject(TYPES.Logger) logger: LoggerInterface) {
    // Utilise TypeOrmDatabase réutilisable
    this.db = new TypeOrmDatabase(
      {
        type: 'postgres',
        entities: [...Object.values(schemas)],
        migrations: [...Object.values(migrations)],
        synchronize: false,
        migrationsRun: envConfig.autoMigration,
        logging: envConfig.logSql,
        namingStrategy: new CustomNamingStrategy(),
      },
      logger,
    );
  }

  getDataSource(): DataSource {
    return this.db.getDataSource();
  }

  async connect(dbUrl: string): Promise<void> {
    await this.db.connect(dbUrl);
  }

  async disconnect(): Promise<void> {
    await this.db.disconnect();
  }

  async runMigrations(): Promise<void> {
    await this.db.runMigrations();
  }
}
