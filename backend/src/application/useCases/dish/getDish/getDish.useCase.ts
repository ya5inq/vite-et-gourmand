import { inject, injectable } from 'inversify';

import { AppErrorCodes } from '@/application/errors/app.error.interface';
import { DishInterface } from '@/domain/entities/dish/dish.entity.interface';
import { DishRepositoryInterface } from '@/domain/interfaces/repositories/dish.repository.interface';

import { AppError } from '@/application/errors/app.error';
import { TYPES } from '@/configuration/di/types';

import { GetDishUseCaseInterface } from './getDish.useCase.interface';

@injectable()
export class GetDishUseCase implements GetDishUseCaseInterface {
  constructor(@inject(TYPES.DishRepository) private dishRepository: DishRepositoryInterface) {}

  async executeGetDish(id: string): Promise<DishInterface> {
    const dish = await this.dishRepository.findById(id);
    if (!dish) {
      throw new AppError({
        code: AppErrorCodes.NOT_FOUND_DISH,
        message: 'Dish not found',
        privateContext: { id },
      });
    }

    return dish;
  }
}
