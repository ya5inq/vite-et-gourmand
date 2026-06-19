import { inject, injectable } from 'inversify';

import { AppErrorCodes } from '@/application/errors/app.error.interface';
import { AllergenRepositoryInterface } from '@/domain/interfaces/repositories/allergen.repository.interface';

import { AppError } from '@/application/errors/app.error';
import { TYPES } from '@/configuration/di/types';

import { DeleteAllergenUseCaseInterface } from './deleteAllergen.useCase.interface';

@injectable()
export class DeleteAllergenUseCase implements DeleteAllergenUseCaseInterface {
  constructor(@inject(TYPES.AllergenRepository) private allergenRepository: AllergenRepositoryInterface) {}

  async executeDeleteAllergen(id: string): Promise<void> {
    const allergen = await this.allergenRepository.findById(id);
    if (!allergen) {
      throw new AppError({
        code: AppErrorCodes.NOT_FOUND_ALLERGEN,
        message: 'Allergen not found',
        privateContext: { id },
      });
    }

    await this.allergenRepository.deleteOne(id);
  }
}
