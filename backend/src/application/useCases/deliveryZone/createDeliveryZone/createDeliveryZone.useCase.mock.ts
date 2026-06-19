import { vi, Mocked } from 'vitest';

import { deliveryZoneFactory } from '@/domain/entities/deliveryZone/deliveryZone.factory';

import { CreateDeliveryZoneUseCaseInterface } from './createDeliveryZone.useCase.interface';

export const getCreateDeliveryZoneUseCaseMock = (): Mocked<CreateDeliveryZoneUseCaseInterface> => ({
  executeCreateDeliveryZone: vi.fn().mockResolvedValue(deliveryZoneFactory()),
});
