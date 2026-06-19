import { MenuInterface } from '@/domain/entities/menu/menu.entity.interface';

export interface GetMenuUseCaseInterface {
  executeGetMenu: (id: string) => Promise<MenuInterface>;
}
