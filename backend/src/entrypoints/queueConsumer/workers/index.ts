import { QueueName } from '@/domain/enums/queues.enum';

import { getMaterialReturnPenaltyWorker } from './materialReturnPenaltyWorker/materialReturnPenalty.worker';

export interface WorkerInterface {
  queue: QueueName;
  handler: (data: unknown) => Promise<unknown>;
}

export const workers: WorkerInterface[] = [getMaterialReturnPenaltyWorker()];
