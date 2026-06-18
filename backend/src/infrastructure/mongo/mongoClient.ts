import { inject, injectable } from 'inversify';
import { Collection, Db, Document, MongoClient as MongoDriverClient } from 'mongodb';

import { LoggerInterface } from '@/domain/interfaces/logger/logger.interface';

import { TYPES } from '@/configuration/di/types';

import { MongoClientInterface } from './mongoClient.interface';

@injectable()
export class MongoClient implements MongoClientInterface {
  private client: MongoDriverClient | null = null;
  private db: Db | null = null;

  constructor(@inject(TYPES.Logger) private logger: LoggerInterface) {}

  async connect(mongoUrl: string): Promise<void> {
    if (this.client) {
      return;
    }

    const client = new MongoDriverClient(mongoUrl);
    await client.connect();

    this.client = client;
    // The database name is taken from the connection string path.
    this.db = client.db();

    this.logger.info('MongoDB connected', { database: this.db.databaseName });
  }

  async disconnect(): Promise<void> {
    if (!this.client) {
      return;
    }
    await this.client.close();
    this.client = null;
    this.db = null;
    this.logger.info('MongoDB disconnected');
  }

  getDb(): Db {
    if (!this.db) {
      throw new Error('MongoDB is not connected. Call connect() first.');
    }
    return this.db;
  }

  getCollection<T extends Document>(name: string): Collection<T> {
    return this.getDb().collection<T>(name);
  }

  isConnected(): boolean {
    return this.db !== null;
  }
}
