import { MenuInterface } from './menu.entity.interface';
import { DietaryRegimeInterface } from '../dietaryRegime/dietaryRegime.entity.interface';
import { DishInterface } from '../dish/dish.entity.interface';

export class Menu implements MenuInterface {
  constructor(
    public id: string,
    public name: string,
    public description: string | null = null,
    public theme: string | null = null,
    public price: number,
    public minPersons: number,
    public maxPersons: number | null = null,
    public stock: number | null = null,
    public conditions: string | null = null,
    public imageUrl: string | null = null,
    public isAvailable: boolean,
    public createdAt: Date,
    public updatedAt: Date,
    public dishes: DishInterface[],
    public dietaryRegimes: DietaryRegimeInterface[],
  ) {}
}
