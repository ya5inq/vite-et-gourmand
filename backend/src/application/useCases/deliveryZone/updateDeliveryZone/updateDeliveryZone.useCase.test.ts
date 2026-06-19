import { describe, beforeEach, vi, expect, it } from 'vitest';

import { getDeliveryZoneRepositoryMock } from '@/adapters/repositories/deliveryZoneRepository/deliveryZone.repository.mock';
import { AppError } from '@/application/errors/app.error';
import { deliveryZoneFactory } from '@/domain/entities/deliveryZone/deliveryZone.factory';

import { UpdateDeliveryZoneUseCase } from './updateDeliveryZone.useCase';

describe('UpdateDeliveryZoneUseCase', () => {
  const deliveryZoneRepositoryMock = getDeliveryZoneRepositoryMock();
  const updateDeliveryZoneUseCase = new UpdateDeliveryZoneUseCase(deliveryZoneRepositoryMock);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should update a delivery zone', async () => {
    const zone = deliveryZoneFactory({ name: 'Pessac' });
    const updated = { ...zone, distanceKm: 6 };
    deliveryZoneRepositoryMock.findById.mockResolvedValueOnce(zone).mockResolvedValueOnce(updated);

    const result = await updateDeliveryZoneUseCase.executeUpdateDeliveryZone({
      id: zone.id,
      data: { distanceKm: 6 },
    });

    expect(deliveryZoneRepositoryMock.updateOne).toHaveBeenCalledWith(zone.id, { distanceKm: 6 });
    expect(result).toEqual(updated);
  });

  it('should throw NOT_FOUND when zone does not exist', async () => {
    deliveryZoneRepositoryMock.findById.mockResolvedValue(null);

    await expect(
      updateDeliveryZoneUseCase.executeUpdateDeliveryZone({ id: 'missing', data: { name: 'X' } }),
    ).rejects.toThrow(AppError);
    expect(deliveryZoneRepositoryMock.updateOne).not.toHaveBeenCalled();
  });
});
