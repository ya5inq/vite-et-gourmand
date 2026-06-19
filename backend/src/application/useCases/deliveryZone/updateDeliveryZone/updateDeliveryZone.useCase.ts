import { inject, injectable } from 'inversify';

import { AppErrorCodes } from '@/application/errors/app.error.interface';
import { DeliveryZoneInterface } from '@/domain/entities/deliveryZone/deliveryZone.entity.interface';
import { DeliveryZoneRepositoryInterface } from '@/domain/interfaces/repositories/deliveryZone.repository.interface';

import { AppError } from '@/application/errors/app.error';
import { TYPES } from '@/configuration/di/types';

import {
  ExecuteUpdateDeliveryZoneOptions,
  UpdateDeliveryZoneUseCaseInterface,
} from './updateDeliveryZone.useCase.interface';

@injectable()
export class UpdateDeliveryZoneUseCase implements UpdateDeliveryZoneUseCaseInterface {
  constructor(@inject(TYPES.DeliveryZoneRepository) private deliveryZoneRepository: DeliveryZoneRepositoryInterface) {}

  async executeUpdateDeliveryZone({ id, data }: ExecuteUpdateDeliveryZoneOptions): Promise<DeliveryZoneInterface> {
    const deliveryZone = await this.deliveryZoneRepository.findById(id);
    if (!deliveryZone) {
      throw new AppError({
        code: AppErrorCodes.NOT_FOUND_DELIVERY_ZONE,
        message: 'Delivery zone not found',
        privateContext: { id },
      });
    }

    await this.deliveryZoneRepository.updateOne(id, data);

    const updated = await this.deliveryZoneRepository.findById(id);
    if (!updated) {
      throw new AppError({
        code: AppErrorCodes.NOT_FOUND_DELIVERY_ZONE,
        message: 'Delivery zone not found after update',
        privateContext: { id },
      });
    }

    return updated;
  }
}
