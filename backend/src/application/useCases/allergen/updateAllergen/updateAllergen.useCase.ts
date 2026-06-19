import { inject, injectable } from 'inversify';

import { AppErrorCodes } from '@/application/errors/app.error.interface';
import { AllergenInterface } from '@/domain/entities/allergen/allergen.entity.interface';
import { AllergenRepositoryInterface } from '@/domain/interfaces/repositories/allergen.repository.interface';

import { AppError } from '@/application/errors/app.error';
import { TYPES } from '@/configuration/di/types';

import { ExecuteUpdateAllergenOptions, UpdateAllergenUseCaseInterface } from './updateAllergen.useCase.interface';

@injectable()
export class UpdateAllergenUseCase implements UpdateAllergenUseCaseInterface {
  constructor(@inject(TYPES.AllergenRepository) private allergenRepository: AllergenRepositoryInterface) {}

  async executeUpdateAllergen({ id, data }: ExecuteUpdateAllergenOptions): Promise<AllergenInterface> {
    const allergen = await this.allergenRepository.findById(id);
    if (!allergen) {
      throw new AppError({
        code: AppErrorCodes.NOT_FOUND_ALLERGEN,
        message: 'Allergen not found',
        privateContext: { id },
      });
    }

    await this.allergenRepository.updateOne(id, data);

    const updated = await this.allergenRepository.findById(id);
    if (!updated) {
      throw new AppError({
        code: AppErrorCodes.NOT_FOUND_ALLERGEN,
        message: 'Allergen not found after update',
        privateContext: { id },
      });
    }

    return updated;
  }
}
