import { DishCategoryType, DishInterface } from './dish.entity.interface';
import { AllergenInterface } from '../allergen/allergen.entity.interface';

export class Dish implements DishInterface {
  constructor(
    public id: string,
    public name: string,
    public description: string | null = null,
    public category: DishCategoryType,
    public price: number | null = null,
    public imageUrl: string | null = null,
    public isAvailable: boolean,
    public createdAt: Date,
    public updatedAt: Date,
    public allergens: AllergenInterface[],
  ) {}
}
