import { vi, Mocked } from 'vitest';

import { OperatingHoursInterface } from '@/domain/entities/operatingHours/operatingHours.entity.interface';
import {
  OperatingHoursRepositoryInterface,
  UpsertOperatingHoursPayloadInterface,
} from '@/domain/interfaces/repositories/operatingHours.repository.interface';

import { operatingHoursFactory } from '@/domain/entities/operatingHours/operatingHours.factory';

export const getOperatingHoursRepositoryMock = (options?: {
  findAll?: OperatingHoursInterface[];
  findByDay?: OperatingHoursInterface | null;
}): Mocked<OperatingHoursRepositoryInterface> => ({
  findAll: vi.fn().mockResolvedValue(options?.findAll ?? []),
  findByDay: vi.fn().mockResolvedValue(options?.findByDay ?? null),
  upsertByDay: vi
    .fn()
    .mockImplementation((payload: UpsertOperatingHoursPayloadInterface) =>
      Promise.resolve(operatingHoursFactory(payload)),
    ),
});
