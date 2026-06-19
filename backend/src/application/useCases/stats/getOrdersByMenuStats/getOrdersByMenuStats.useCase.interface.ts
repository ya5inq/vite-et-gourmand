import { OrdersByMenuResultInterface } from '@/domain/interfaces/adapters/analytics.repository.interface';

export interface GetOrdersByMenuStatsParamsInterface {
  menuId?: string;
  from?: Date;
  to?: Date;
}

export interface GetOrdersByMenuStatsUseCaseInterface {
  executeGetOrdersByMenuStats(params: GetOrdersByMenuStatsParamsInterface): Promise<OrdersByMenuResultInterface[]>;
}
