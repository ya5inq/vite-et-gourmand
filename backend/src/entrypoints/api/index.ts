import 'dotenv/config';
import 'reflect-metadata';
import { ServerType } from '@hono/node-server';

import { I18nInterface } from '@/application/i18n/i18n.interface';
import { EnvConfigInterface } from '@/domain/interfaces/adapters/envConfig.interface';
import { QueueManagerInterface } from '@/domain/interfaces/adapters/queueManager.interface';
import { LoggerInterface } from '@/domain/interfaces/logger/logger.interface';
import { ClientDatabaseInterface } from '@/infrastructure/database/clientDatabase/clientDatabase.interface';
import { MongoClientInterface } from '@/infrastructure/mongo/mongoClient.interface';

import { AppError } from '@/application/errors/app.error';
import { errorTranslations, customValidationTranslations, successTranslations } from '@/application/i18n/translations';
import { mainContainer } from '@/configuration/di/mainContainer';
import { TYPES } from '@/configuration/di/types';
import { ensureMongoIndexes } from '@/infrastructure/mongo/ensureIndexes';

import { bootstrap } from './loader/server';
import { runShutdownCallbacks } from './loader/shutdownRegistry';
import { workers } from '../queueConsumer/workers';

let clientDatabase: ClientDatabaseInterface;
let mongoClient: MongoClientInterface;
let queueManager: QueueManagerInterface;
let server: ServerType;
let appLogger: LoggerInterface;

const shutdownGracefully = async (error?: Error) => {
  try {
    if (error) {
      appLogger?.error('Error starting server', error);
    }

    if (clientDatabase) {
      await clientDatabase.disconnect().catch((err) => {
        appLogger?.error('Error disconnecting database', err);
      });
    }

    if (mongoClient) {
      await mongoClient.disconnect().catch((err) => {
        appLogger?.error('Error disconnecting MongoDB', err);
      });
    }

    if (queueManager) {
      await queueManager.stop().catch((err) => {
        appLogger?.error('Error stopping queue manager', err);
      });
    }

    // Run all registered shutdown callbacks
    await runShutdownCallbacks((name, err) => {
      appLogger?.error(`Error stopping ${name}`, err);
    });

    if (server) {
      server.close();
    }
  } catch (shutdownError) {
    appLogger?.error('Error during shutdown', shutdownError);
  } finally {
    if (error) {
      process.exit(1);
    }
  }
};

// Intercepter les signaux d'arrêt pour nettoyer proprement
process.on('SIGTERM', () => {
  void shutdownGracefully();
});
process.on('SIGINT', () => {
  void shutdownGracefully();
});

const init = async () => {
  try {
    clientDatabase = mainContainer.get<ClientDatabaseInterface>(TYPES.ClientDatabase);
    mongoClient = mainContainer.get<MongoClientInterface>(TYPES.MongoClient);
    queueManager = mainContainer.get<QueueManagerInterface>(TYPES.QueueManager);
    const envConfig = mainContainer.get<EnvConfigInterface>(TYPES.EnvConfig);
    appLogger = mainContainer.get<LoggerInterface>(TYPES.Logger);
    const i18n = mainContainer.get<I18nInterface>(TYPES.I18n);

    // Initialize AppError logger singleton (must be done once at startup)
    AppError.setLogger(appLogger);

    // Initialize i18n for Zod error translations and success messages
    await i18n.init({ errorTranslations, customValidationTranslations, successTranslations });

    await clientDatabase.connect(envConfig.dbUrl);

    // MongoDB powers analytics/audit (a derived view). A failure here must not
    // prevent the API from starting — writes are fault-tolerant and no-op.
    if (envConfig.mongoUrl) {
      try {
        await mongoClient.connect(envConfig.mongoUrl);
        await ensureMongoIndexes(mongoClient);
      } catch (mongoError) {
        appLogger.warn('MongoDB unavailable at startup — analytics/audit disabled', {
          error: mongoError instanceof Error ? mongoError.message : 'unknown',
        });
      }
    } else {
      appLogger.warn('MONGO_URL not set — analytics/audit disabled');
    }

    // pg-boss powers the material-return penalty cron + worker. Best-effort,
    // like Mongo: a failure here must not prevent the API from starting.
    try {
      await queueManager.start(envConfig.dbUrl);
      await Promise.all(workers.map((worker) => queueManager.setupWorker(worker.queue, worker.handler)));
    } catch (queueError) {
      appLogger.warn('pg-boss unavailable at startup — background jobs disabled', {
        error: queueError instanceof Error ? queueError.message : 'unknown',
      });
    }

    const bootstrapData = bootstrap();

    server = bootstrapData.server;
  } catch (error) {
    await shutdownGracefully(error as Error);
  }
};

void init();
