import { inject, injectable } from 'inversify';

import {
  DietaryRegimeRepositoryInterface,
  FindAllDietaryRegimesParamsInterface,
} from '@/domain/interfaces/repositories/dietaryRegime.repository.interface';

import { TYPES } from '@/configuration/di/types';

import {
  GetAllDietaryRegimesResultInterface,
  GetAllDietaryRegimesUseCaseInterface,
} from './getAllDietaryRegimes.useCase.interface';

@injectable()
export class GetAllDietaryRegimesUseCase implements GetAllDietaryRegimesUseCaseInterface {
  constructor(
    @inject(TYPES.DietaryRegimeRepository) private dietaryRegimeRepository: DietaryRegimeRepositoryInterface,
  ) {}

  async executeGetAllDietaryRegimes(
    params?: FindAllDietaryRegimesParamsInterface,
  ): Promise<GetAllDietaryRegimesResultInterface> {
    const [items, totalCount] = await Promise.all([
      this.dietaryRegimeRepository.findAll(params),
      this.dietaryRegimeRepository.countFindAll(params),
    ]);

    return { items, totalCount };
  }
}
