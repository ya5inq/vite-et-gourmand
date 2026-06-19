import { describe, beforeEach, vi, expect, it } from 'vitest';

import { getDeliveryZoneRepositoryMock } from '@/adapters/repositories/deliveryZoneRepository/deliveryZone.repository.mock';
import { AppError } from '@/application/errors/app.error';
import { deliveryZoneFactory } from '@/domain/entities/deliveryZone/deliveryZone.factory';

import { BASE_FEE, CalculateDeliveryPriceUseCase, PER_KM, computeDeliveryFee } from './calculateDeliveryPrice.useCase';

describe('CalculateDeliveryPriceUseCase', () => {
  const deliveryZoneRepositoryMock = getDeliveryZoneRepositoryMock();
  const calculateDeliveryPriceUseCase = new CalculateDeliveryPriceUseCase(deliveryZoneRepositoryMock);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('computeDeliveryFee (pricing rule)', () => {
    it('should be free (0€) inside Bordeaux (0 km)', () => {
      expect(computeDeliveryFee(0)).toBe(0);
    });

    it('should charge 5 + 0.59*8 = 9.72€ at 8 km', () => {
      expect(computeDeliveryFee(8)).toBe(9.72);
    });

    it('should charge 5 + 0.59*6 = 8.54€ at 6 km', () => {
      expect(computeDeliveryFee(6)).toBe(8.54);
    });

    it('should round correctly at 30 km (5 + 0.59*30 = 22.7€)', () => {
      expect(computeDeliveryFee(30)).toBe(22.7);
    });

    it('should round to 2 decimals (5 + 0.59*5 = 7.95€)', () => {
      expect(computeDeliveryFee(5)).toBe(7.95);
    });

    it('should expose named constants', () => {
      expect(BASE_FEE).toBe(5);
      expect(PER_KM).toBe(0.59);
    });
  });

  it('should calculate price from a delivery zone id (Bordeaux → 0€)', async () => {
    const zone = deliveryZoneFactory({ name: 'Bordeaux Centre', city: 'Bordeaux', distanceKm: 0 });
    deliveryZoneRepositoryMock.findById.mockResolvedValue(zone);

    const result = await calculateDeliveryPriceUseCase.executeCalculateDeliveryPrice({ deliveryZoneId: zone.id });

    expect(deliveryZoneRepositoryMock.findById).toHaveBeenCalledWith(zone.id);
    expect(result).toEqual({
      zoneId: zone.id,
      zoneName: 'Bordeaux Centre',
      city: 'Bordeaux',
      distanceKm: 0,
      deliveryFee: 0,
    });
  });

  it('should calculate price from a postal code (Merignac 8km → 9.72€)', async () => {
    const zone = deliveryZoneFactory({ name: 'Merignac', city: 'Merignac', postalCode: '33700', distanceKm: 8 });
    deliveryZoneRepositoryMock.findByPostalCode.mockResolvedValue(zone);

    const result = await calculateDeliveryPriceUseCase.executeCalculateDeliveryPrice({ postalCode: '33700' });

    expect(deliveryZoneRepositoryMock.findByPostalCode).toHaveBeenCalledWith('33700');
    expect(result.deliveryFee).toBe(9.72);
    expect(result.distanceKm).toBe(8);
  });

  it('should throw NOT_FOUND_DELIVERY_ZONE when zone is missing', async () => {
    deliveryZoneRepositoryMock.findById.mockResolvedValue(null);

    await expect(
      calculateDeliveryPriceUseCase.executeCalculateDeliveryPrice({ deliveryZoneId: 'missing' }),
    ).rejects.toThrow(AppError);
  });

  it('should throw NOT_FOUND_DELIVERY_ZONE when neither id nor postal code is provided', async () => {
    await expect(calculateDeliveryPriceUseCase.executeCalculateDeliveryPrice({})).rejects.toThrow(AppError);
  });
});
