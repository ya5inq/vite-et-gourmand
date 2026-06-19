import { inject, injectable } from 'inversify';

import { AppErrorCodes } from '@/application/errors/app.error.interface';
import { MenuRepositoryInterface } from '@/domain/interfaces/repositories/menu.repository.interface';

import { AppError } from '@/application/errors/app.error';
import { TYPES } from '@/configuration/di/types';

import { DeleteMenuUseCaseInterface } from './deleteMenu.useCase.interface';

@injectable()
export class DeleteMenuUseCase implements DeleteMenuUseCaseInterface {
  constructor(@inject(TYPES.MenuRepository) private menuRepository: MenuRepositoryInterface) {}

  async executeDeleteMenu(id: string): Promise<void> {
    const menu = await this.menuRepository.findById(id);
    if (!menu) {
      throw new AppError({
        code: AppErrorCodes.NOT_FOUND_MENU,
        message: 'Menu not found',
        privateContext: { id },
      });
    }

    await this.menuRepository.deleteOne(id);
  }
}
