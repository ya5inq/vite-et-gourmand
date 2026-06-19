import { Mocked, vi } from 'vitest';

import { PgBossClientInterface } from './pgBossClient.interface';

export const getPgBossClientMock = (): Mocked<PgBossClientInterface> => ({
  start: vi.fn().mockResolvedValue(undefined),
  stop: vi.fn().mockResolvedValue(undefined),
  createQueue: vi.fn().mockResolvedValue(undefined),
  scheduleCron: vi.fn().mockResolvedValue(undefined),
  removeSchedule: vi.fn().mockResolvedValue(undefined),
  getAllScheduleIds: vi.fn().mockResolvedValue([]),
  setupWorker: vi.fn().mockResolvedValue(undefined),
});
