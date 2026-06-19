import { AllergenInterface } from '../allergen/allergen.entity.interface';

export enum DishCategory {
  ENTREE = 'entree',
  PLAT = 'plat',
  DESSERT = 'dessert',
}

export type DishCategoryType = DishCategory;
export const DishCategoryValues = Object.values(DishCategory) as [DishCategoryType, ...DishCategoryType[]];

export interface DishInterface {
  id: string;
  name: string;
  description: string | null;
  category: DishCategoryType;
  price: number | null;
  imageUrl: string | null;
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
  allergens: AllergenInterface[];
}
