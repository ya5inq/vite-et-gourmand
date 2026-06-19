import { inject, injectable } from 'inversify';

import {
  FindAllMenusParamsInterface,
  MenuRepositoryInterface,
} from '@/domain/interfaces/repositories/menu.repository.interface';

import { TYPES } from '@/configuration/di/types';

import { GetAllMenusResultInterface, GetAllMenusUseCaseInterface } from './getAllMenus.useCase.interface';

@injectable()
export class GetAllMenusUseCase implements GetAllMenusUseCaseInterface {
  constructor(@inject(TYPES.MenuRepository) private menuRepository: MenuRepositoryInterface) {}

  async executeGetAllMenus(params?: FindAllMenusParamsInterface): Promise<GetAllMenusResultInterface> {
    const [items, totalCount] = await Promise.all([
      this.menuRepository.findAll(params),
      this.menuRepository.countFindAll(params),
    ]);

    return { items, totalCount };
  }
}
