import { inject, injectable } from 'inversify';

import { AppErrorCodes } from '@/application/errors/app.error.interface';
import { DeliveryZoneInterface } from '@/domain/entities/deliveryZone/deliveryZone.entity.interface';
import { DeliveryZoneRepositoryInterface } from '@/domain/interfaces/repositories/deliveryZone.repository.interface';

import { AppError } from '@/application/errors/app.error';
import { TYPES } from '@/configuration/di/types';

import {
  CalculateDeliveryPriceParamsInterface,
  CalculateDeliveryPriceResultInterface,
  CalculateDeliveryPriceUseCaseInterface,
} from './calculateDeliveryPrice.useCase.interface';

/**
 * Delivery pricing rule (Vite & Gourmand business rule):
 *  - Inside Bordeaux (distanceKm === 0) → free delivery (0 €).
 *  - Outside Bordeaux → BASE_FEE (5 €) + PER_KM (0,59 €) per kilometre from
 *    Bordeaux centre, rounded to 2 decimals.
 */
export const BASE_FEE = 5;
export const PER_KM = 0.59;

export const computeDeliveryFee = (distanceKm: number): number => {
  if (distanceKm <= 0) {
    return 0;
  }
  const fee = BASE_FEE + PER_KM * distanceKm;
  return Math.round(fee * 100) / 100;
};

@injectable()
export class CalculateDeliveryPriceUseCase implements CalculateDeliveryPriceUseCaseInterface {
  constructor(@inject(TYPES.DeliveryZoneRepository) private deliveryZoneRepository: DeliveryZoneRepositoryInterface) {}

  async executeCalculateDeliveryPrice(
    params: CalculateDeliveryPriceParamsInterface,
  ): Promise<CalculateDeliveryPriceResultInterface> {
    const { deliveryZoneId, postalCode } = params;

    let zone: DeliveryZoneInterface | null = null;
    if (deliveryZoneId) {
      zone = await this.deliveryZoneRepository.findById(deliveryZoneId);
    } else if (postalCode) {
      zone = await this.deliveryZoneRepository.findByPostalCode(postalCode);
    }

    if (!zone) {
      throw new AppError({
        code: AppErrorCodes.NOT_FOUND_DELIVERY_ZONE,
        message: 'Delivery zone not found',
        privateContext: { deliveryZoneId, postalCode },
      });
    }

    return {
      zoneId: zone.id,
      zoneName: zone.name,
      city: zone.city,
      distanceKm: zone.distanceKm,
      deliveryFee: computeDeliveryFee(zone.distanceKm),
    };
  }
}
