import { describe, beforeEach, vi, expect, it } from 'vitest';

import { getDeliveryZoneRepositoryMock } from '@/adapters/repositories/deliveryZoneRepository/deliveryZone.repository.mock';
import { AppError } from '@/application/errors/app.error';
import { deliveryZoneFactory } from '@/domain/entities/deliveryZone/deliveryZone.factory';

import { DeleteDeliveryZoneUseCase } from './deleteDeliveryZone.useCase';

describe('DeleteDeliveryZoneUseCase', () => {
  const deliveryZoneRepositoryMock = getDeliveryZoneRepositoryMock();
  const deleteDeliveryZoneUseCase = new DeleteDeliveryZoneUseCase(deliveryZoneRepositoryMock);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should delete a delivery zone', async () => {
    const zone = deliveryZoneFactory();
    deliveryZoneRepositoryMock.findById.mockResolvedValue(zone);

    await deleteDeliveryZoneUseCase.executeDeleteDeliveryZone(zone.id);

    expect(deliveryZoneRepositoryMock.deleteOne).toHaveBeenCalledWith(zone.id);
  });

  it('should throw NOT_FOUND when zone does not exist', async () => {
    deliveryZoneRepositoryMock.findById.mockResolvedValue(null);

    await expect(deleteDeliveryZoneUseCase.executeDeleteDeliveryZone('missing')).rejects.toThrow(AppError);
    expect(deliveryZoneRepositoryMock.deleteOne).not.toHaveBeenCalled();
  });
});
