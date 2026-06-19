import { describe, beforeEach, vi, expect, it } from 'vitest';

import { getDeliveryZoneRepositoryMock } from '@/adapters/repositories/deliveryZoneRepository/deliveryZone.repository.mock';
import { deliveryZoneFactory } from '@/domain/entities/deliveryZone/deliveryZone.factory';

import { GetAllDeliveryZonesUseCase } from './getAllDeliveryZones.useCase';

describe('GetAllDeliveryZonesUseCase', () => {
  const deliveryZoneRepositoryMock = getDeliveryZoneRepositoryMock();
  const getAllDeliveryZonesUseCase = new GetAllDeliveryZonesUseCase(deliveryZoneRepositoryMock);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return delivery zones and totalCount', async () => {
    const zones = [deliveryZoneFactory(), deliveryZoneFactory()];
    deliveryZoneRepositoryMock.findAll.mockResolvedValue(zones);
    deliveryZoneRepositoryMock.countFindAll.mockResolvedValue(2);

    const result = await getAllDeliveryZonesUseCase.executeGetAllDeliveryZones();

    expect(result.items).toEqual(zones);
    expect(result.totalCount).toBe(2);
  });

  it('should forward isActive filter to the repository', async () => {
    deliveryZoneRepositoryMock.findAll.mockResolvedValue([]);
    deliveryZoneRepositoryMock.countFindAll.mockResolvedValue(0);

    await getAllDeliveryZonesUseCase.executeGetAllDeliveryZones({ isActive: true });

    expect(deliveryZoneRepositoryMock.findAll).toHaveBeenCalledWith({ isActive: true });
  });
});
