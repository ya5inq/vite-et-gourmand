import { MenuInterface } from '@/domain/entities/menu/menu.entity.interface';
import { FindAllMenusParamsInterface } from '@/domain/interfaces/repositories/menu.repository.interface';

export interface GetAllMenusResultInterface {
  items: MenuInterface[];
  totalCount: number;
}

export interface GetAllMenusUseCaseInterface {
  executeGetAllMenus: (params?: FindAllMenusParamsInterface) => Promise<GetAllMenusResultInterface>;
}
