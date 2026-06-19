import { OrderInterface } from '@/domain/entities/order/order.entity.interface';
import { FindOrdersByUserParamsInterface } from '@/domain/interfaces/repositories/order.repository.interface';

export interface GetUserOrdersParamsInterface extends FindOrdersByUserParamsInterface {
  userId: string;
}

export interface GetUserOrdersResultInterface {
  items: OrderInterface[];
  totalCount: number;
}

export interface GetUserOrdersUseCaseInterface {
  executeGetUserOrders: (params: GetUserOrdersParamsInterface) => Promise<GetUserOrdersResultInterface>;
}
