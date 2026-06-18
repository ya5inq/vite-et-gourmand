import { DataSource } from 'typeorm';

export interface TypeOrmDatabaseInterface {
  getDataSource(): DataSource;
  connect(url: string): Promise<void>;
  disconnect(): Promise<void>;
  runMigrations(): Promise<void>;
}
