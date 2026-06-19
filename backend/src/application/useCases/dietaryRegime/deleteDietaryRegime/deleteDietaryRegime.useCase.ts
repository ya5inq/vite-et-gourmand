import { inject, injectable } from 'inversify';

import { AppErrorCodes } from '@/application/errors/app.error.interface';
import { DietaryRegimeRepositoryInterface } from '@/domain/interfaces/repositories/dietaryRegime.repository.interface';

import { AppError } from '@/application/errors/app.error';
import { TYPES } from '@/configuration/di/types';

import { DeleteDietaryRegimeUseCaseInterface } from './deleteDietaryRegime.useCase.interface';

@injectable()
export class DeleteDietaryRegimeUseCase implements DeleteDietaryRegimeUseCaseInterface {
  constructor(
    @inject(TYPES.DietaryRegimeRepository) private dietaryRegimeRepository: DietaryRegimeRepositoryInterface,
  ) {}

  async executeDeleteDietaryRegime(id: string): Promise<void> {
    const regime = await this.dietaryRegimeRepository.findById(id);
    if (!regime) {
      throw new AppError({
        code: AppErrorCodes.NOT_FOUND_DIETARY_REGIME,
        message: 'Dietary regime not found',
        privateContext: { id },
      });
    }

    await this.dietaryRegimeRepository.deleteOne(id);
  }
}
