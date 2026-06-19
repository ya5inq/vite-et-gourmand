import { inject, injectable } from 'inversify';

import {
  AnalyticsRepositoryInterface,
  RevenueByMenuResultInterface,
} from '@/domain/interfaces/adapters/analytics.repository.interface';

import { TYPES } from '@/configuration/di/types';

import {
  GetRevenueByMenuStatsParamsInterface,
  GetRevenueByMenuStatsUseCaseInterface,
} from './getRevenueByMenuStats.useCase.interface';

@injectable()
export class GetRevenueByMenuStatsUseCase implements GetRevenueByMenuStatsUseCaseInterface {
  constructor(@inject(TYPES.AnalyticsRepository) private analyticsRepository: AnalyticsRepositoryInterface) {}

  executeGetRevenueByMenuStats(params: GetRevenueByMenuStatsParamsInterface): Promise<RevenueByMenuResultInterface[]> {
    // Revenue per menu over a period, read from MongoDB (order_stats).
    return this.analyticsRepository.getRevenueByMenu({
      menuId: params.menuId,
      from: params.from,
      to: params.to,
    });
  }
}
