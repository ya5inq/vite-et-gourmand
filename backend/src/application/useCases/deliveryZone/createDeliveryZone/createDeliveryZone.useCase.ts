import { inject, injectable } from 'inversify';

import { DeliveryZoneInterface } from '@/domain/entities/deliveryZone/deliveryZone.entity.interface';
import { DeliveryZoneRepositoryInterface } from '@/domain/interfaces/repositories/deliveryZone.repository.interface';

import { TYPES } from '@/configuration/di/types';
import { DeliveryZone } from '@/domain/entities/deliveryZone/deliveryZone.entity';

import {
  CreateDeliveryZoneDataInterface,
  CreateDeliveryZoneUseCaseInterface,
} from './createDeliveryZone.useCase.interface';

@injectable()
export class CreateDeliveryZoneUseCase implements CreateDeliveryZoneUseCaseInterface {
  constructor(@inject(TYPES.DeliveryZoneRepository) private deliveryZoneRepository: DeliveryZoneRepositoryInterface) {}

  async executeCreateDeliveryZone(data: CreateDeliveryZoneDataInterface): Promise<DeliveryZoneInterface> {
    const deliveryZone = new DeliveryZone(
      '',
      data.name,
      data.postalCode ?? null,
      data.city ?? null,
      data.distanceKm ?? 0,
      data.isActive ?? true,
      new Date(),
    );
    return this.deliveryZoneRepository.create(deliveryZone);
  }
}
