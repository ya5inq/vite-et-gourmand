import { inject, injectable } from 'inversify';

import { AllergenInterface } from '@/domain/entities/allergen/allergen.entity.interface';
import { AllergenRepositoryInterface } from '@/domain/interfaces/repositories/allergen.repository.interface';

import { TYPES } from '@/configuration/di/types';
import { Allergen } from '@/domain/entities/allergen/allergen.entity';

import { CreateAllergenDataInterface, CreateAllergenUseCaseInterface } from './createAllergen.useCase.interface';

@injectable()
export class CreateAllergenUseCase implements CreateAllergenUseCaseInterface {
  constructor(@inject(TYPES.AllergenRepository) private allergenRepository: AllergenRepositoryInterface) {}

  async executeCreateAllergen(data: CreateAllergenDataInterface): Promise<AllergenInterface> {
    const allergen = new Allergen('', data.name, data.icon ?? null, new Date());
    return this.allergenRepository.create(allergen);
  }
}
