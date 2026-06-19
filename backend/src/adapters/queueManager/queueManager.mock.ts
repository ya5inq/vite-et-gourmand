import { Mocked, vi } from 'vitest';

import { QueueManagerInterface } from '@/domain/interfaces/adapters/queueManager.interface';

export const getQueueManagerMock = (): Mocked<QueueManagerInterface> => ({
  start: vi.fn().mockResolvedValue(undefined),
  stop: vi.fn().mockResolvedValue(undefined),
  scheduleCron: vi.fn().mockResolvedValue(undefined),
  removeOldSchedules: vi.fn().mockResolvedValue(undefined),
  setupWorker: vi.fn().mockResolvedValue(undefined),
});
