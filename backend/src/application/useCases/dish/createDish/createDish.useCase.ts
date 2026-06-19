import { inject, injectable } from 'inversify';

import { DishInterface } from '@/domain/entities/dish/dish.entity.interface';
import { AllergenRepositoryInterface } from '@/domain/interfaces/repositories/allergen.repository.interface';
import { DishRepositoryInterface } from '@/domain/interfaces/repositories/dish.repository.interface';

import { TYPES } from '@/configuration/di/types';
import { Dish } from '@/domain/entities/dish/dish.entity';

import { CreateDishDataInterface, CreateDishUseCaseInterface } from './createDish.useCase.interface';

@injectable()
export class CreateDishUseCase implements CreateDishUseCaseInterface {
  constructor(
    @inject(TYPES.DishRepository) private dishRepository: DishRepositoryInterface,
    @inject(TYPES.AllergenRepository) private allergenRepository: AllergenRepositoryInterface,
  ) {}

  async executeCreateDish(data: CreateDishDataInterface): Promise<DishInterface> {
    const allergens =
      data.allergenIds && data.allergenIds.length > 0 ? await this.allergenRepository.findByIds(data.allergenIds) : [];

    const now = new Date();
    const dish = new Dish(
      '',
      data.name,
      data.description ?? null,
      data.category,
      data.price ?? null,
      data.imageUrl ?? null,
      data.isAvailable ?? true,
      now,
      now,
      allergens,
    );

    return this.dishRepository.create(dish);
  }
}
