import { inject, injectable } from 'inversify';

import { MenuInterface } from '@/domain/entities/menu/menu.entity.interface';
import { DietaryRegimeRepositoryInterface } from '@/domain/interfaces/repositories/dietaryRegime.repository.interface';
import { DishRepositoryInterface } from '@/domain/interfaces/repositories/dish.repository.interface';
import { MenuRepositoryInterface } from '@/domain/interfaces/repositories/menu.repository.interface';

import { TYPES } from '@/configuration/di/types';
import { Menu } from '@/domain/entities/menu/menu.entity';

import { CreateMenuDataInterface, CreateMenuUseCaseInterface } from './createMenu.useCase.interface';

@injectable()
export class CreateMenuUseCase implements CreateMenuUseCaseInterface {
  constructor(
    @inject(TYPES.MenuRepository) private menuRepository: MenuRepositoryInterface,
    @inject(TYPES.DishRepository) private dishRepository: DishRepositoryInterface,
    @inject(TYPES.DietaryRegimeRepository) private dietaryRegimeRepository: DietaryRegimeRepositoryInterface,
  ) {}

  async executeCreateMenu(data: CreateMenuDataInterface): Promise<MenuInterface> {
    const dishes = data.dishIds && data.dishIds.length > 0 ? await this.dishRepository.findByIds(data.dishIds) : [];
    const dietaryRegimes =
      data.dietaryRegimeIds && data.dietaryRegimeIds.length > 0
        ? await this.dietaryRegimeRepository.findByIds(data.dietaryRegimeIds)
        : [];

    const now = new Date();
    const menu = new Menu(
      '',
      data.name,
      data.description ?? null,
      data.theme ?? null,
      data.price,
      data.minPersons ?? 1,
      data.maxPersons ?? null,
      data.stock ?? null,
      data.conditions ?? null,
      data.imageUrl ?? null,
      data.isAvailable ?? true,
      now,
      now,
      dishes,
      dietaryRegimes,
    );

    return this.menuRepository.create(menu);
  }
}
