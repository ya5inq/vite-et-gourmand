import { inject, injectable } from 'inversify';

import {
  QueueManagerInterface,
  ScheduleCronOptionsInterface,
} from '@/domain/interfaces/adapters/queueManager.interface';
import { PgBossClientInterface } from '@/infrastructure/pgboss/pgBossClient.interface';

import { TYPES } from '@/configuration/di/types';
import { QueueName } from '@/domain/enums/queues.enum';

/**
 * Bridges the domain QueueManager interface with the pg-boss infrastructure
 * client. Ensures every declared queue exists on start.
 */
@injectable()
export class QueueManager implements QueueManagerInterface {
  constructor(@inject(TYPES.PgBossClient) private client: PgBossClientInterface) {}

  async start(dbUrl: string): Promise<void> {
    await this.client.start(dbUrl);
    for (const queue of Object.values(QueueName)) {
      await this.client.createQueue(queue);
    }
  }

  stop(): Promise<void> {
    return this.client.stop();
  }

  scheduleCron(options: ScheduleCronOptionsInterface): Promise<void> {
    return this.client.scheduleCron(options);
  }

  async removeOldSchedules(activeCron: string[]): Promise<void> {
    const schedules = await this.client.getAllScheduleIds();
    for (const schedule of schedules) {
      if (!activeCron.includes(schedule)) {
        await this.client.removeSchedule(schedule);
      }
    }
  }

  setupWorker(queue: string, handler: (data: unknown) => Promise<unknown>): Promise<void> {
    return this.client.setupWorker(queue, handler);
  }
}
