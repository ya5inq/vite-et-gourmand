import 'dotenv/config';
import 'reflect-metadata';

import { EnvConfigInterface } from '@/domain/interfaces/adapters/envConfig.interface';
import { QueueManagerInterface } from '@/domain/interfaces/adapters/queueManager.interface';
import { LoggerInterface } from '@/domain/interfaces/logger/logger.interface';

import { mainContainer } from '@/configuration/di/mainContainer';
import { TYPES } from '@/configuration/di/types';

import { crons } from './crons';

/**
 * Registers (or refreshes) the recurring jobs on pg-boss.
 * Run manually with `pnpm --filter backend start:cron`.
 */
export async function setupCron(): Promise<void> {
  const envConfig = mainContainer.get<EnvConfigInterface>(TYPES.EnvConfig);
  const queueManager = mainContainer.get<QueueManagerInterface>(TYPES.QueueManager);
  const logger = mainContainer.get<LoggerInterface>(TYPES.Logger);

  await queueManager.start(envConfig.dbUrl);

  await queueManager.removeOldSchedules(crons.map((cron) => cron.queue));
  await Promise.all(crons.map((cron) => queueManager.scheduleCron(cron)));

  logger.info('Cron schedules set up', { crons: crons.map((cron) => cron.queue) });

  await queueManager.stop();
}

void setupCron();
