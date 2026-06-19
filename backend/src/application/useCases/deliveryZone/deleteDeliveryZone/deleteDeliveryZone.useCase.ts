import { inject, injectable } from 'inversify';

import { AppErrorCodes } from '@/application/errors/app.error.interface';
import { DeliveryZoneRepositoryInterface } from '@/domain/interfaces/repositories/deliveryZone.repository.interface';

import { AppError } from '@/application/errors/app.error';
import { TYPES } from '@/configuration/di/types';

import { DeleteDeliveryZoneUseCaseInterface } from './deleteDeliveryZone.useCase.interface';

@injectable()
export class DeleteDeliveryZoneUseCase implements DeleteDeliveryZoneUseCaseInterface {
  constructor(@inject(TYPES.DeliveryZoneRepository) private deliveryZoneRepository: DeliveryZoneRepositoryInterface) {}

  async executeDeleteDeliveryZone(id: string): Promise<void> {
    const deliveryZone = await this.deliveryZoneRepository.findById(id);
    if (!deliveryZone) {
      throw new AppError({
        code: AppErrorCodes.NOT_FOUND_DELIVERY_ZONE,
        message: 'Delivery zone not found',
        privateContext: { id },
      });
    }

    await this.deliveryZoneRepository.deleteOne(id);
  }
}
