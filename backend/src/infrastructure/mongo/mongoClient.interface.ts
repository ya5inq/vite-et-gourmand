import { Collection, Db, Document } from 'mongodb';

export interface MongoClientInterface {
  /**
   * Establishes the connection to MongoDB. Idempotent: a second call while
   * already connected resolves immediately.
   */
  connect(mongoUrl: string): Promise<void>;
  disconnect(): Promise<void>;
  /**
   * Returns the active database handle. Throws if called before connect().
   */
  getDb(): Db;
  /**
   * Convenience accessor for a typed collection.
   */
  getCollection<T extends Document>(name: string): Collection<T>;
  isConnected(): boolean;
}
