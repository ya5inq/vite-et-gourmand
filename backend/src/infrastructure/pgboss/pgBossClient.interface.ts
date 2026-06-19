export interface PgBossScheduleCronOptionsInterface {
  queue: string;
  cronTime: string;
  data: object;
}

/**
 * Thin wrapper around pg-boss — infrastructure only, no domain dependencies.
 * The domain talks to QueueManager (adapter), which delegates here.
 */
export interface PgBossClientInterface {
  start(dbUrl: string): Promise<void>;
  stop(): Promise<void>;
  createQueue(queue: string): Promise<void>;
  scheduleCron(options: PgBossScheduleCronOptionsInterface): Promise<void>;
  removeSchedule(scheduleName: string): Promise<void>;
  getAllScheduleIds(): Promise<string[]>;
  setupWorker(queue: string, handler: (data: unknown) => Promise<unknown>): Promise<void>;
}
