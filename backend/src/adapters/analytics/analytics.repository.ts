import { inject, injectable } from 'inversify';
import { Filter } from 'mongodb';

import {
  AnalyticsPeriodFilterOptions,
  AnalyticsRepositoryInterface,
  OrderStatDocumentInterface,
  OrdersByMenuResultInterface,
  RecordOrderStatsOptions,
  RevenueByMenuResultInterface,
} from '@/domain/interfaces/adapters/analytics.repository.interface';
import { LoggerInterface } from '@/domain/interfaces/logger/logger.interface';
import { MongoClientInterface } from '@/infrastructure/mongo/mongoClient.interface';

import { TYPES } from '@/configuration/di/types';

const COLLECTION = 'order_stats';

@injectable()
export class AnalyticsRepository implements AnalyticsRepositoryInterface {
  constructor(
    @inject(TYPES.MongoClient) private mongoClient: MongoClientInterface,
    @inject(TYPES.Logger) private logger: LoggerInterface,
  ) {}

  private collection() {
    return this.mongoClient.getCollection<OrderStatDocumentInterface>(COLLECTION);
  }

  async recordOrderStats(options: RecordOrderStatsOptions): Promise<void> {
    try {
      const { orderId, orderStatus, orderedAt, completedAt, lines } = options;

      // Replace any previously recorded lines for this order to stay idempotent.
      await this.collection().deleteMany({ orderId });

      if (lines.length === 0) {
        return;
      }

      const documents: OrderStatDocumentInterface[] = lines.map((line) => ({
        orderId,
        menuId: line.menuId,
        menuName: line.menuName,
        quantity: line.quantity,
        unitPrice: line.unitPrice,
        lineRevenue: line.lineRevenue,
        orderStatus,
        orderedAt,
        completedAt: completedAt ?? null,
      }));

      await this.collection().insertMany(documents);
    } catch (error) {
      this.logger.error('Failed to record order stats in Mongo', error, { orderId: options.orderId });
    }
  }

  async updateOrderStatus(orderId: string, orderStatus: string, completedAt?: Date | null): Promise<void> {
    try {
      await this.collection().updateMany({ orderId }, { $set: { orderStatus, completedAt: completedAt ?? null } });
    } catch (error) {
      this.logger.error('Failed to update order stats status in Mongo', error, { orderId });
    }
  }

  private buildMatch(filter?: AnalyticsPeriodFilterOptions): Filter<OrderStatDocumentInterface> {
    const match: Filter<OrderStatDocumentInterface> = {};
    if (filter?.menuId) {
      match.menuId = filter.menuId;
    }
    if (filter?.from || filter?.to) {
      match.orderedAt = {};
      if (filter.from) {
        match.orderedAt.$gte = filter.from;
      }
      if (filter.to) {
        match.orderedAt.$lte = filter.to;
      }
    }
    return match;
  }

  async getOrdersByMenu(filter?: AnalyticsPeriodFilterOptions): Promise<OrdersByMenuResultInterface[]> {
    const results = await this.collection()
      .aggregate<{ _id: string; menuName: string; orderCount: number; totalQuantity: number }>([
        { $match: this.buildMatch(filter) },
        {
          $group: {
            _id: '$menuId',
            menuName: { $first: '$menuName' },
            orderIds: { $addToSet: '$orderId' },
            totalQuantity: { $sum: '$quantity' },
          },
        },
        {
          $project: {
            menuName: 1,
            totalQuantity: 1,
            orderCount: { $size: '$orderIds' },
          },
        },
        { $sort: { orderCount: -1 } },
      ])
      .toArray();

    return results.map((r) => ({
      menuId: r._id,
      menuName: r.menuName,
      orderCount: r.orderCount,
      totalQuantity: r.totalQuantity,
    }));
  }

  async getRevenueByMenu(filter?: AnalyticsPeriodFilterOptions): Promise<RevenueByMenuResultInterface[]> {
    const results = await this.collection()
      .aggregate<{ _id: string; menuName: string; revenue: number }>([
        { $match: this.buildMatch(filter) },
        {
          $group: {
            _id: '$menuId',
            menuName: { $first: '$menuName' },
            revenue: { $sum: '$lineRevenue' },
          },
        },
        { $sort: { revenue: -1 } },
      ])
      .toArray();

    return results.map((r) => ({
      menuId: r._id,
      menuName: r.menuName,
      revenue: r.revenue,
    }));
  }
}
