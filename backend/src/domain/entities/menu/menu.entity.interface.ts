import { DietaryRegimeInterface } from '../dietaryRegime/dietaryRegime.entity.interface';
import { DishInterface } from '../dish/dish.entity.interface';

export interface MenuInterface {
  id: string;
  name: string;
  description: string | null;
  theme: string | null;
  price: number;
  minPersons: number;
  maxPersons: number | null;
  stock: number | null;
  conditions: string | null;
  imageUrl: string | null;
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
  dishes: DishInterface[];
  dietaryRegimes: DietaryRegimeInterface[];
}
