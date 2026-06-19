import { inject, injectable } from 'inversify';

import {
  DeliveryZoneRepositoryInterface,
  FindAllDeliveryZonesParamsInterface,
} from '@/domain/interfaces/repositories/deliveryZone.repository.interface';

import { TYPES } from '@/configuration/di/types';

import {
  GetAllDeliveryZonesResultInterface,
  GetAllDeliveryZonesUseCaseInterface,
} from './getAllDeliveryZones.useCase.interface';

@injectable()
export class GetAllDeliveryZonesUseCase implements GetAllDeliveryZonesUseCaseInterface {
  constructor(@inject(TYPES.DeliveryZoneRepository) private deliveryZoneRepository: DeliveryZoneRepositoryInterface) {}

  async executeGetAllDeliveryZones(
    params?: FindAllDeliveryZonesParamsInterface,
  ): Promise<GetAllDeliveryZonesResultInterface> {
    const [items, totalCount] = await Promise.all([
      this.deliveryZoneRepository.findAll(params),
      this.deliveryZoneRepository.countFindAll(params),
    ]);

    return { items, totalCount };
  }
}
