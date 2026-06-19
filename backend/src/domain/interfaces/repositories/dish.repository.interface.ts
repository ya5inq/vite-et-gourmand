import { DishCategoryType, DishInterface } from '@/domain/entities/dish/dish.entity.interface';

export type SortOrder = 'ASC' | 'DESC';
export type DishSortBy = 'name' | 'price' | 'category' | 'createdAt' | 'updatedAt';

export interface FindAllDishesParamsInterface {
  category?: DishCategoryType;
  isAvailable?: boolean;
  search?: string;
  limit?: number;
  offset?: number;
  sortBy?: DishSortBy;
  sortOrder?: SortOrder;
}

export interface DishRepositoryInterface {
  findById: (id: string) => Promise<DishInterface | null>;
  findByIds: (ids: string[]) => Promise<DishInterface[]>;
  findAll: (params?: FindAllDishesParamsInterface) => Promise<DishInterface[]>;
  countFindAll: (params?: FindAllDishesParamsInterface) => Promise<number>;
  /** Persists a dish, replacing its allergen associations with the given ones. */
  create: (dish: DishInterface) => Promise<DishInterface>;
  updateOne: (id: string, data: Partial<DishInterface>) => Promise<void>;
  deleteOne: (id: string) => Promise<void>;
}
