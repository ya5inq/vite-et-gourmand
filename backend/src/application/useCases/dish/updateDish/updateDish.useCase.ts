import { inject, injectable } from 'inversify';

import { AppErrorCodes } from '@/application/errors/app.error.interface';
import { DishInterface } from '@/domain/entities/dish/dish.entity.interface';
import { AllergenRepositoryInterface } from '@/domain/interfaces/repositories/allergen.repository.interface';
import { DishRepositoryInterface } from '@/domain/interfaces/repositories/dish.repository.interface';

import { AppError } from '@/application/errors/app.error';
import { TYPES } from '@/configuration/di/types';

import { ExecuteUpdateDishOptions, UpdateDishUseCaseInterface } from './updateDish.useCase.interface';

@injectable()
export class UpdateDishUseCase implements UpdateDishUseCaseInterface {
  constructor(
    @inject(TYPES.DishRepository) private dishRepository: DishRepositoryInterface,
    @inject(TYPES.AllergenRepository) private allergenRepository: AllergenRepositoryInterface,
  ) {}

  async executeUpdateDish({ id, data }: ExecuteUpdateDishOptions): Promise<DishInterface> {
    const dish = await this.dishRepository.findById(id);
    if (!dish) {
      throw new AppError({
        code: AppErrorCodes.NOT_FOUND_DISH,
        message: 'Dish not found',
        privateContext: { id },
      });
    }

    const { allergenIds, ...scalarData } = data;

    const updatePayload: Partial<DishInterface> = { ...scalarData };

    if (allergenIds !== undefined) {
      updatePayload.allergens = allergenIds.length > 0 ? await this.allergenRepository.findByIds(allergenIds) : [];
    }

    await this.dishRepository.updateOne(id, updatePayload);

    const updated = await this.dishRepository.findById(id);
    if (!updated) {
      throw new AppError({
        code: AppErrorCodes.NOT_FOUND_DISH,
        message: 'Dish not found after update',
        privateContext: { id },
      });
    }

    return updated;
  }
}
