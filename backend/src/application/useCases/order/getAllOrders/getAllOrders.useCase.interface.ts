import { OrderInterface } from '@/domain/entities/order/order.entity.interface';
import { FindAllOrdersParamsInterface } from '@/domain/interfaces/repositories/order.repository.interface';

export type GetAllOrdersParamsInterface = FindAllOrdersParamsInterface;

export interface GetAllOrdersResultInterface {
  items: OrderInterface[];
  totalCount: number;
}

export interface GetAllOrdersUseCaseInterface {
  executeGetAllOrders: (params: GetAllOrdersParamsInterface) => Promise<GetAllOrdersResultInterface>;
}
