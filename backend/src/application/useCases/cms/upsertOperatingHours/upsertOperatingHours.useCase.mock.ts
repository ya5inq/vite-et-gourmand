import { vi, Mocked } from 'vitest';

import { UpsertOperatingHoursUseCaseInterface } from './upsertOperatingHours.useCase.interface';

export const getUpsertOperatingHoursUseCaseMock = (): Mocked<UpsertOperatingHoursUseCaseInterface> => ({
  executeUpsertOperatingHours: vi.fn().mockResolvedValue([]),
});
