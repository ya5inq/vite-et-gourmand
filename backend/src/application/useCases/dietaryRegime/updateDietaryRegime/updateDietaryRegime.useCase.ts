import { inject, injectable } from 'inversify';

import { AppErrorCodes } from '@/application/errors/app.error.interface';
import { DietaryRegimeInterface } from '@/domain/entities/dietaryRegime/dietaryRegime.entity.interface';
import { DietaryRegimeRepositoryInterface } from '@/domain/interfaces/repositories/dietaryRegime.repository.interface';

import { AppError } from '@/application/errors/app.error';
import { TYPES } from '@/configuration/di/types';

import {
  ExecuteUpdateDietaryRegimeOptions,
  UpdateDietaryRegimeUseCaseInterface,
} from './updateDietaryRegime.useCase.interface';

@injectable()
export class UpdateDietaryRegimeUseCase implements UpdateDietaryRegimeUseCaseInterface {
  constructor(
    @inject(TYPES.DietaryRegimeRepository) private dietaryRegimeRepository: DietaryRegimeRepositoryInterface,
  ) {}

  async executeUpdateDietaryRegime({ id, data }: ExecuteUpdateDietaryRegimeOptions): Promise<DietaryRegimeInterface> {
    const regime = await this.dietaryRegimeRepository.findById(id);
    if (!regime) {
      throw new AppError({
        code: AppErrorCodes.NOT_FOUND_DIETARY_REGIME,
        message: 'Dietary regime not found',
        privateContext: { id },
      });
    }

    await this.dietaryRegimeRepository.updateOne(id, data);

    const updated = await this.dietaryRegimeRepository.findById(id);
    if (!updated) {
      throw new AppError({
        code: AppErrorCodes.NOT_FOUND_DIETARY_REGIME,
        message: 'Dietary regime not found after update',
        privateContext: { id },
      });
    }

    return updated;
  }
}
