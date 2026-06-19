import { DishCategoryType, DishInterface } from '@/domain/entities/dish/dish.entity.interface';

export interface CreateDishDataInterface {
  name: string;
  description?: string | null;
  category: DishCategoryType;
  price?: number | null;
  imageUrl?: string | null;
  isAvailable?: boolean;
  allergenIds?: string[];
}

export interface CreateDishUseCaseInterface {
  executeCreateDish: (data: CreateDishDataInterface) => Promise<DishInterface>;
}
