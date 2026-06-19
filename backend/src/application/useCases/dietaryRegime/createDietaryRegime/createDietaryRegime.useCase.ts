import { inject, injectable } from 'inversify';

import { DietaryRegimeInterface } from '@/domain/entities/dietaryRegime/dietaryRegime.entity.interface';
import { DietaryRegimeRepositoryInterface } from '@/domain/interfaces/repositories/dietaryRegime.repository.interface';

import { TYPES } from '@/configuration/di/types';
import { DietaryRegime } from '@/domain/entities/dietaryRegime/dietaryRegime.entity';

import {
  CreateDietaryRegimeDataInterface,
  CreateDietaryRegimeUseCaseInterface,
} from './createDietaryRegime.useCase.interface';

@injectable()
export class CreateDietaryRegimeUseCase implements CreateDietaryRegimeUseCaseInterface {
  constructor(
    @inject(TYPES.DietaryRegimeRepository) private dietaryRegimeRepository: DietaryRegimeRepositoryInterface,
  ) {}

  async executeCreateDietaryRegime(data: CreateDietaryRegimeDataInterface): Promise<DietaryRegimeInterface> {
    const regime = new DietaryRegime('', data.name, data.description ?? null, new Date());
    return this.dietaryRegimeRepository.create(regime);
  }
}
