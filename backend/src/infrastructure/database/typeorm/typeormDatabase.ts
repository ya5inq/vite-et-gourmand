import { DataSource, DataSourceOptions } from 'typeorm';

import { LoggerInterface } from '@/domain/interfaces/logger/logger.interface';

import { TypeOrmDatabaseInterface } from './typeormDatabase.interface';

// Interface config dans le même fichier (pas de .config.ts séparé)
export interface TypeOrmDatabaseConfigOptions {
  type: 'postgres' | 'mysql' | 'sqlite' | 'mariadb' | 'mongodb';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  entities: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  migrations?: any[];
  synchronize?: boolean;
  migrationsRun?: boolean;
  logging?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  namingStrategy?: any;
}

// Module sans @injectable pour réutilisabilité
export class TypeOrmDatabase implements TypeOrmDatabaseInterface {
  private dataSource: DataSource;

  constructor(
    config: TypeOrmDatabaseConfigOptions,
    private logger?: LoggerInterface,
  ) {
    this.dataSource = new DataSource(config as DataSourceOptions);
  }

  getDataSource(): DataSource {
    return this.dataSource;
  }

  async connect(url: string): Promise<void> {
    this.dataSource.setOptions({ url });

    try {
      await this.dataSource.initialize();
      this.logger?.debug('Database connected successfully');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger?.error('Database connection error', error, {
        message: errorMessage,
        dbUrl: url ? '***' : undefined, // Mask URL for security
      });
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    await this.dataSource.destroy();
    this.logger?.debug('Database disconnected');
  }

  async runMigrations(): Promise<void> {
    await this.dataSource.runMigrations({ transaction: 'all' });
    this.logger?.debug('Migrations executed successfully');
  }
}
