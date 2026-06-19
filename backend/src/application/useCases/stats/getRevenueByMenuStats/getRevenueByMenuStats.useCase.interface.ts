import { RevenueByMenuResultInterface } from '@/domain/interfaces/adapters/analytics.repository.interface';

export interface GetRevenueByMenuStatsParamsInterface {
  menuId?: string;
  from?: Date;
  to?: Date;
}

export interface GetRevenueByMenuStatsUseCaseInterface {
  executeGetRevenueByMenuStats(params: GetRevenueByMenuStatsParamsInterface): Promise<RevenueByMenuResultInterface[]>;
}
