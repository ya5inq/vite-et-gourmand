import { QueueName } from '@/domain/enums/queues.enum';

interface CronInterface {
  queue: QueueName;
  cronTime: string;
  data: object;
}

export const crons: CronInterface[] = [
  {
    // Every day at 06:00 — charge the 600€ penalty on overdue material returns.
    queue: QueueName.MATERIAL_RETURN_PENALTY,
    cronTime: '0 6 * * *',
    data: {},
  },
];
