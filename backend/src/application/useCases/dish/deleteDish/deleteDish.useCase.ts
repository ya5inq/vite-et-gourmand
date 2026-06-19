import { inject, injectable } from 'inversify';

import { AppErrorCodes } from '@/application/errors/app.error.interface';
import { DishRepositoryInterface } from '@/domain/interfaces/repositories/dish.repository.interface';

import { AppError } from '@/application/errors/app.error';
import { TYPES } from '@/configuration/di/types';

import { DeleteDishUseCaseInterface } from './deleteDish.useCase.interface';

@injectable()
export class DeleteDishUseCase implements DeleteDishUseCaseInterface {
  constructor(@inject(TYPES.DishRepository) private dishRepository: DishRepositoryInterface) {}

  async executeDeleteDish(id: string): Promise<void> {
    const dish = await this.dishRepository.findById(id);
    if (!dish) {
      throw new AppError({
        code: AppErrorCodes.NOT_FOUND_DISH,
        message: 'Dish not found',
        privateContext: { id },
      });
    }

    await this.dishRepository.deleteOne(id);
  }
}
