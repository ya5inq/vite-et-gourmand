import { vi, Mocked } from 'vitest';

import { deliveryZoneFactory } from '@/domain/entities/deliveryZone/deliveryZone.factory';

import { UpdateDeliveryZoneUseCaseInterface } from './updateDeliveryZone.useCase.interface';

export const getUpdateDeliveryZoneUseCaseMock = (): Mocked<UpdateDeliveryZoneUseCaseInterface> => ({
  executeUpdateDeliveryZone: vi.fn().mockResolvedValue(deliveryZoneFactory()),
});
