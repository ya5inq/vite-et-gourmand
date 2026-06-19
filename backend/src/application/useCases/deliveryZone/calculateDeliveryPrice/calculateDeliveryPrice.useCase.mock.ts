import { vi, Mocked } from 'vitest';

import { CalculateDeliveryPriceUseCaseInterface } from './calculateDeliveryPrice.useCase.interface';

export const getCalculateDeliveryPriceUseCaseMock = (): Mocked<CalculateDeliveryPriceUseCaseInterface> => ({
  executeCalculateDeliveryPrice: vi.fn().mockResolvedValue({
    zoneId: 'zone-id',
    zoneName: 'Bordeaux Centre',
    city: 'Bordeaux',
    distanceKm: 0,
    deliveryFee: 0,
  }),
});
