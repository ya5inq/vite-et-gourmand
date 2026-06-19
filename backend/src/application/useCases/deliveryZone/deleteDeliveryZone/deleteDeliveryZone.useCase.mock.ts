import { vi, Mocked } from 'vitest';

import { DeleteDeliveryZoneUseCaseInterface } from './deleteDeliveryZone.useCase.interface';

export const getDeleteDeliveryZoneUseCaseMock = (): Mocked<DeleteDeliveryZoneUseCaseInterface> => ({
  executeDeleteDeliveryZone: vi.fn().mockResolvedValue(undefined),
});
