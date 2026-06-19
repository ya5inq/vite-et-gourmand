import { MenuInterface } from '@/domain/entities/menu/menu.entity.interface';

export interface UpdateMenuDataInterface {
  name?: string;
  description?: string | null;
  theme?: string | null;
  price?: number;
  minPersons?: number;
  maxPersons?: number | null;
  stock?: number | null;
  conditions?: string | null;
  imageUrl?: string | null;
  isAvailable?: boolean;
  /** When provided, replaces the menu's dish associations. */
  dishIds?: string[];
  /** When provided, replaces the menu's dietary regime associations. */
  dietaryRegimeIds?: string[];
}

export interface ExecuteUpdateMenuOptions {
  id: string;
  data: UpdateMenuDataInterface;
}

export interface UpdateMenuUseCaseInterface {
  executeUpdateMenu: (options: ExecuteUpdateMenuOptions) => Promise<MenuInterface>;
}
