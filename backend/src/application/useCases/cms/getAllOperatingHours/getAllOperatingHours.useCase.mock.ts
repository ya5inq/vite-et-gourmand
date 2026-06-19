import { vi, Mocked } from 'vitest';

import { GetAllOperatingHoursUseCaseInterface } from './getAllOperatingHours.useCase.interface';

export const getGetAllOperatingHoursUseCaseMock = (): Mocked<GetAllOperatingHoursUseCaseInterface> => ({
  executeGetAllOperatingHours: vi.fn().mockResolvedValue([]),
});
