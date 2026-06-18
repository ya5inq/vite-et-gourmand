import 'dotenv/config';
import 'reflect-metadata';
import { ServerType } from '@hono/node-server';

import { I18nInterface } from '@/application/i18n/i18n.interface';
import { EnvConfigInterface } from '@/domain/interfaces/adapters/envConfig.interface';
import { LoggerInterface } from '@/domain/interfaces/logger/logger.interface';
import { ClientDatabaseInterface } from '@/infrastructure/database/clientDatabase/clientDatabase.interface';

import { AppError } from '@/application/errors/app.error';
import { errorTranslations, customValidationTranslations, successTranslations } from '@/application/i18n/translations';
import { mainContainer } from '@/configuration/di/mainContainer';
import { TYPES } from '@/configuration/di/types';

import { bootstrap } from './loader/server';
import { runShutdownCallbacks } from './loader/shutdownRegistry';

let clientDatabase: ClientDatabaseInterface;
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
    const envConfig = mainContainer.get<EnvConfigInterface>(TYPES.EnvConfig);
    appLogger = mainContainer.get<LoggerInterface>(TYPES.Logger);
    const i18n = mainContainer.get<I18nInterface>(TYPES.I18n);

    // Initialize AppError logger singleton (must be done once at startup)
    AppError.setLogger(appLogger);

    // Initialize i18n for Zod error translations and success messages
    await i18n.init({ errorTranslations, customValidationTranslations, successTranslations });

    await clientDatabase.connect(envConfig.dbUrl);

    const bootstrapData = bootstrap();

    server = bootstrapData.server;
  } catch (error) {
    await shutdownGracefully(error as Error);
  }
};

void init();
