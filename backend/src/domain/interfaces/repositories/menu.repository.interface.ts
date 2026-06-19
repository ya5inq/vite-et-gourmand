import { MenuInterface } from '@/domain/entities/menu/menu.entity.interface';

export type SortOrder = 'ASC' | 'DESC';
export type MenuSortBy = 'name' | 'price' | 'minPersons' | 'createdAt' | 'updatedAt';

export interface FindAllMenusParamsInterface {
  theme?: string;
  dietaryRegimeId?: string;
  /**
   * Filter by the number of persons the user has: show menus whose
   * `min_persons` is lower than or equal to the given value (i.e. menus the
   * user can actually order for that headcount).
   */
  maxMinPersons?: number;
  priceMin?: number;
  priceMax?: number;
  isAvailable?: boolean;
  search?: string;
  limit?: number;
  offset?: number;
  sortBy?: MenuSortBy;
  sortOrder?: SortOrder;
}

export interface MenuRepositoryInterface {
  findById: (id: string) => Promise<MenuInterface | null>;
  findAll: (params?: FindAllMenusParamsInterface) => Promise<MenuInterface[]>;
  countFindAll: (params?: FindAllMenusParamsInterface) => Promise<number>;
  create: (menu: MenuInterface) => Promise<MenuInterface>;
  updateOne: (id: string, data: Partial<MenuInterface>) => Promise<void>;
  deleteOne: (id: string) => Promise<void>;
}
