import { DishInterface } from '@/domain/entities/dish/dish.entity.interface';

export interface GetDishUseCaseInterface {
  executeGetDish: (id: string) => Promise<DishInterface>;
}
