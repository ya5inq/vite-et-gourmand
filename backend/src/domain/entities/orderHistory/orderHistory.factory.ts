import { faker } from '@faker-js/faker';

import { buildFactory } from '@/configuration/utils/buildFactory';

import { OrderHistoryInterface } from './orderHistory.entity.interface';
import { OrderStatusEnum } from '../order/orderStatus';

const buildSchema = (): OrderHistoryInterface => ({
  id: faker.string.uuid(),
  orderId: faker.string.uuid(),
  oldStatus: null,
  newStatus: OrderStatusEnum.PENDING,
  changedBy: null,
  reason: null,
  contactMode: null,
  createdAt: faker.date.recent(),
});

export const orderHistoryFactory = (args?: Partial<OrderHistoryInterface>): OrderHistoryInterface =>
  buildFactory<OrderHistoryInterface>(buildSchema())(args);
