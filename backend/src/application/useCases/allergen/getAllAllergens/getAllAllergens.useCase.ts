import { inject, injectable } from 'inversify';

import {
  AllergenRepositoryInterface,
  FindAllAllergensParamsInterface,
} from '@/domain/interfaces/repositories/allergen.repository.interface';

import { TYPES } from '@/configuration/di/types';

import { GetAllAllergensResultInterface, GetAllAllergensUseCaseInterface } from './getAllAllergens.useCase.interface';

@injectable()
export class GetAllAllergensUseCase implements GetAllAllergensUseCaseInterface {
  constructor(@inject(TYPES.AllergenRepository) private allergenRepository: AllergenRepositoryInterface) {}

  async executeGetAllAllergens(params?: FindAllAllergensParamsInterface): Promise<GetAllAllergensResultInterface> {
    const [items, totalCount] = await Promise.all([
      this.allergenRepository.findAll(params),
      this.allergenRepository.countFindAll(params),
    ]);

    return { items, totalCount };
  }
}
