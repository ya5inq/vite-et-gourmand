import { describe, beforeEach, vi, expect, it } from 'vitest';

import { getDeliveryZoneRepositoryMock } from '@/adapters/repositories/deliveryZoneRepository/deliveryZone.repository.mock';
import { deliveryZoneFactory } from '@/domain/entities/deliveryZone/deliveryZone.factory';

import { CreateDeliveryZoneUseCase } from './createDeliveryZone.useCase';

describe('CreateDeliveryZoneUseCase', () => {
  const deliveryZoneRepositoryMock = getDeliveryZoneRepositoryMock();
  const createDeliveryZoneUseCase = new CreateDeliveryZoneUseCase(deliveryZoneRepositoryMock);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create a delivery zone', async () => {
    const zone = deliveryZoneFactory({ name: 'Mérignac', city: 'Mérignac', distanceKm: 8 });
    deliveryZoneRepositoryMock.create.mockResolvedValue(zone);

    const result = await createDeliveryZoneUseCase.executeCreateDeliveryZone({
      name: 'Mérignac',
      city: 'Mérignac',
      distanceKm: 8,
    });

    expect(deliveryZoneRepositoryMock.create).toHaveBeenCalledTimes(1);
    expect(result).toEqual(zone);
  });

  it('should default optional fields when not provided', async () => {
    deliveryZoneRepositoryMock.create.mockImplementation((z) => Promise.resolve(z));

    await createDeliveryZoneUseCase.executeCreateDeliveryZone({ name: 'Bordeaux Centre' });

    const created = deliveryZoneRepositoryMock.create.mock.calls[0][0];
    expect(created.postalCode).toBeNull();
    expect(created.city).toBeNull();
    expect(created.distanceKm).toBe(0);
    expect(created.isActive).toBe(true);
  });
});
