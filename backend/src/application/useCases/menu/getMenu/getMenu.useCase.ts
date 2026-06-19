import { inject, injectable } from 'inversify';

import { AppErrorCodes } from '@/application/errors/app.error.interface';
import { MenuInterface } from '@/domain/entities/menu/menu.entity.interface';
import { MenuRepositoryInterface } from '@/domain/interfaces/repositories/menu.repository.interface';

import { AppError } from '@/application/errors/app.error';
import { TYPES } from '@/configuration/di/types';

import { GetMenuUseCaseInterface } from './getMenu.useCase.interface';

@injectable()
export class GetMenuUseCase implements GetMenuUseCaseInterface {
  constructor(@inject(TYPES.MenuRepository) private menuRepository: MenuRepositoryInterface) {}

  async executeGetMenu(id: string): Promise<MenuInterface> {
    const menu = await this.menuRepository.findById(id);
    if (!menu) {
      throw new AppError({
        code: AppErrorCodes.NOT_FOUND_MENU,
        message: 'Menu not found',
        privateContext: { id },
      });
    }

    return menu;
  }
}
