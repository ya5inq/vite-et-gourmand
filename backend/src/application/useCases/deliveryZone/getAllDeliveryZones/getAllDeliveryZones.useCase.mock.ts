import { vi, Mocked } from 'vitest';

import { GetAllDeliveryZonesUseCaseInterface } from './getAllDeliveryZones.useCase.interface';

export const getGetAllDeliveryZonesUseCaseMock = (): Mocked<GetAllDeliveryZonesUseCaseInterface> => ({
  executeGetAllDeliveryZones: vi.fn().mockResolvedValue({ items: [], totalCount: 0 }),
});
