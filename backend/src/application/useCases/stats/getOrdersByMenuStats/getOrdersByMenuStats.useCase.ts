import { inject, injectable } from 'inversify';

import {
  AnalyticsRepositoryInterface,
  OrdersByMenuResultInterface,
} from '@/domain/interfaces/adapters/analytics.repository.interface';

import { TYPES } from '@/configuration/di/types';

import {
  GetOrdersByMenuStatsParamsInterface,
  GetOrdersByMenuStatsUseCaseInterface,
} from './getOrdersByMenuStats.useCase.interface';

@injectable()
export class GetOrdersByMenuStatsUseCase implements GetOrdersByMenuStatsUseCaseInterface {
  constructor(@inject(TYPES.AnalyticsRepository) private analyticsRepository: AnalyticsRepositoryInterface) {}

  executeGetOrdersByMenuStats(params: GetOrdersByMenuStatsParamsInterface): Promise<OrdersByMenuResultInterface[]> {
    // Reads from MongoDB (order_stats collection) — the non-relational store
    // required by the ECF for analytics.
    return this.analyticsRepository.getOrdersByMenu({
      menuId: params.menuId,
      from: params.from,
      to: params.to,
    });
  }
}
