import { inject, injectable } from 'inversify';

import {
  DishRepositoryInterface,
  FindAllDishesParamsInterface,
} from '@/domain/interfaces/repositories/dish.repository.interface';

import { TYPES } from '@/configuration/di/types';

import { GetAllDishesResultInterface, GetAllDishesUseCaseInterface } from './getAllDishes.useCase.interface';

@injectable()
export class GetAllDishesUseCase implements GetAllDishesUseCaseInterface {
  constructor(@inject(TYPES.DishRepository) private dishRepository: DishRepositoryInterface) {}

  async executeGetAllDishes(params?: FindAllDishesParamsInterface): Promise<GetAllDishesResultInterface> {
    const [items, totalCount] = await Promise.all([
      this.dishRepository.findAll(params),
      this.dishRepository.countFindAll(params),
    ]);

    return { items, totalCount };
  }
}
