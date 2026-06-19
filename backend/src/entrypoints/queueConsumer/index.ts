import 'dotenv/config';
import 'reflect-metadata';

import { EnvConfigInterface } from '@/domain/interfaces/adapters/envConfig.interface';
import { QueueManagerInterface } from '@/domain/interfaces/adapters/queueManager.interface';
import { LoggerInterface } from '@/domain/interfaces/logger/logger.interface';
import { ClientDatabaseInterface } from '@/infrastructure/database/clientDatabase/clientDatabase.interface';
import { MongoClientInterface } from '@/infrastructure/mongo/mongoClient.interface';

import { mainContainer } from '@/configuration/di/mainContainer';
import { TYPES } from '@/configuration/di/types';

import { workers } from './workers';

/**
 * Long-running queue consumer: connects to the databases and registers the
 * job workers on pg-boss. Run with `pnpm --filter backend start:queue`.
 */
export async function setupQueueConsumer(): Promise<void> {
  const envConfig = mainContainer.get<EnvConfigInterface>(TYPES.EnvConfig);
  const queueManager = mainContainer.get<QueueManagerInterface>(TYPES.QueueManager);
  const clientDatabase = mainContainer.get<ClientDatabaseInterface>(TYPES.ClientDatabase);
  const mongoClient = mainContainer.get<MongoClientInterface>(TYPES.MongoClient);
  const logger = mainContainer.get<LoggerInterface>(TYPES.Logger);

  await clientDatabase.connect(envConfig.dbUrl);

  if (envConfig.mongoUrl) {
    try {
      await mongoClient.connect(envConfig.mongoUrl);
    } catch (mongoError) {
      logger.warn('MongoDB unavailable for queue consumer — audit disabled', {
        error: mongoError instanceof Error ? mongoError.message : 'unknown',
      });
    }
  }

  await queueManager.start(envConfig.dbUrl);
  await Promise.all(workers.map((worker) => queueManager.setupWorker(worker.queue, worker.handler)));

  logger.info('Queue consumer ready', { workers: workers.map((worker) => worker.queue) });
}

void setupQueueConsumer();
