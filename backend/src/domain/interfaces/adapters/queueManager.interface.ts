export interface ScheduleCronOptionsInterface {
  queue: string;
  cronTime: string;
  data: object;
}

/**
 * Abstract queue management interface. The technical implementation (pg-boss)
 * lives in infrastructure/pgboss/.
 */
export interface QueueManagerInterface {
  start(dbUrl: string): Promise<void>;
  stop(): Promise<void>;
  scheduleCron(options: ScheduleCronOptionsInterface): Promise<void>;
  /** Removes any scheduled cron that is no longer in the active list. */
  removeOldSchedules(activeCron: string[]): Promise<void>;
  setupWorker(queue: string, handler: (data: unknown) => Promise<unknown>): Promise<void>;
}
