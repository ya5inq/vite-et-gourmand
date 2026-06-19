import { inject, injectable } from 'inversify';
import PgBoss, { Job } from 'pg-boss';

import { LoggerInterface } from '@/domain/interfaces/logger/logger.interface';

import { TYPES } from '@/configuration/di/types';

import { PgBossClientInterface, PgBossScheduleCronOptionsInterface } from './pgBossClient.interface';

/**
 * Minimal pg-boss wrapper. pg-boss creates and manages its own `pgboss` schema
 * on `start()`, so no extra migration step is required.
 */
@injectable()
export class PgBossClient implements PgBossClientInterface {
  private boss: PgBoss | null = null;

  constructor(@inject(TYPES.Logger) private logger: LoggerInterface) {}

  async start(dbUrl: string): Promise<void> {
    if (this.boss) {
      return;
    }
    this.boss = new PgBoss({ connectionString: dbUrl });
    await this.boss.start();
    this.logger.info('PgBoss started');
  }

  async stop(): Promise<void> {
    if (!this.boss) {
      return;
    }
    await this.boss.stop({ graceful: true });
    this.boss = null;
    this.logger.info('PgBoss stopped');
  }

  async createQueue(queue: string): Promise<void> {
    await this.getBoss().createQueue(queue);
  }

  async scheduleCron({ queue, cronTime, data }: PgBossScheduleCronOptionsInterface): Promise<void> {
    await this.getBoss().schedule(queue, cronTime, data);
    this.logger.info('PgBoss cron scheduled', { queue, cronTime });
  }

  async removeSchedule(scheduleName: string): Promise<void> {
    await this.getBoss().unschedule(scheduleName);
  }

  async getAllScheduleIds(): Promise<string[]> {
    const schedules = await this.getBoss().getSchedules();
    return schedules.map((schedule) => schedule.name);
  }

  async setupWorker(queue: string, handler: (data: unknown) => Promise<unknown>): Promise<void> {
    await this.getBoss().work(queue, async ([job]: Job[]) => {
      return handler(job.data);
    });
    this.logger.info('PgBoss worker registered', { queue });
  }

  private getBoss(): PgBoss {
    if (!this.boss) {
      throw new Error('PgBossClient not started. Call start() first.');
    }
    return this.boss;
  }
}
