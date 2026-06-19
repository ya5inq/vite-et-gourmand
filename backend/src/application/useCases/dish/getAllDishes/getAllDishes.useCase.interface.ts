import { DishInterface } from '@/domain/entities/dish/dish.entity.interface';
import { FindAllDishesParamsInterface } from '@/domain/interfaces/repositories/dish.repository.interface';

export interface GetAllDishesResultInterface {
  items: DishInterface[];
  totalCount: number;
}

export interface GetAllDishesUseCaseInterface {
  executeGetAllDishes: (params?: FindAllDishesParamsInterface) => Promise<GetAllDishesResultInterface>;
}
