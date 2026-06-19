import { inject, injectable } from 'inversify';

import { AppErrorCodes } from '@/application/errors/app.error.interface';
import { MenuInterface } from '@/domain/entities/menu/menu.entity.interface';
import { DietaryRegimeRepositoryInterface } from '@/domain/interfaces/repositories/dietaryRegime.repository.interface';
import { DishRepositoryInterface } from '@/domain/interfaces/repositories/dish.repository.interface';
import { MenuRepositoryInterface } from '@/domain/interfaces/repositories/menu.repository.interface';

import { AppError } from '@/application/errors/app.error';
import { TYPES } from '@/configuration/di/types';

import { ExecuteUpdateMenuOptions, UpdateMenuUseCaseInterface } from './updateMenu.useCase.interface';

@injectable()
export class UpdateMenuUseCase implements UpdateMenuUseCaseInterface {
  constructor(
    @inject(TYPES.MenuRepository) private menuRepository: MenuRepositoryInterface,
    @inject(TYPES.DishRepository) private dishRepository: DishRepositoryInterface,
    @inject(TYPES.DietaryRegimeRepository) private dietaryRegimeRepository: DietaryRegimeRepositoryInterface,
  ) {}

  async executeUpdateMenu({ id, data }: ExecuteUpdateMenuOptions): Promise<MenuInterface> {
    const menu = await this.menuRepository.findById(id);
    if (!menu) {
      throw new AppError({
        code: AppErrorCodes.NOT_FOUND_MENU,
        message: 'Menu not found',
        privateContext: { id },
      });
    }

    const { dishIds, dietaryRegimeIds, ...scalarData } = data;

    const updatePayload: Partial<MenuInterface> = { ...scalarData };

    if (dishIds !== undefined) {
      updatePayload.dishes = dishIds.length > 0 ? await this.dishRepository.findByIds(dishIds) : [];
    }

    if (dietaryRegimeIds !== undefined) {
      updatePayload.dietaryRegimes =
        dietaryRegimeIds.length > 0 ? await this.dietaryRegimeRepository.findByIds(dietaryRegimeIds) : [];
    }

    await this.menuRepository.updateOne(id, updatePayload);

    const updated = await this.menuRepository.findById(id);
    if (!updated) {
      throw new AppError({
        code: AppErrorCodes.NOT_FOUND_MENU,
        message: 'Menu not found after update',
        privateContext: { id },
      });
    }

    return updated;
  }
}
