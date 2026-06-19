import { DishCategoryType, DishInterface } from '@/domain/entities/dish/dish.entity.interface';

export interface UpdateDishDataInterface {
  name?: string;
  description?: string | null;
  category?: DishCategoryType;
  price?: number | null;
  imageUrl?: string | null;
  isAvailable?: boolean;
  /** When provided, replaces the dish's allergen associations. */
  allergenIds?: string[];
}

export interface ExecuteUpdateDishOptions {
  id: string;
  data: UpdateDishDataInterface;
}

export interface UpdateDishUseCaseInterface {
  executeUpdateDish: (options: ExecuteUpdateDishOptions) => Promise<DishInterface>;
}
