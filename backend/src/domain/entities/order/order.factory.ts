import { faker } from '@faker-js/faker';

import { buildFactory } from '@/configuration/utils/buildFactory';

import { OrderInterface } from './order.entity.interface';
import { OrderStatusEnum } from './orderStatus';

const buildSchema = (): OrderInterface => ({
  id: faker.string.uuid(),
  userId: faker.string.uuid(),
  status: OrderStatusEnum.PENDING,
  guestEmail: null,
  guestName: null,
  guestPhone: null,
  deliveryAddress: faker.location.streetAddress(),
  deliveryCity: faker.location.city(),
  deliveryPostalCode: faker.location.zipCode('#####'),
  deliveryZoneId: faker.string.uuid(),
  deliveryDate: faker.date.soon(),
  deliveryFee: 0,
  totalPrice: parseFloat(faker.commerce.price({ min: 100, max: 1000 })),
  notes: null,
  rejectionReason: null,
  rejectedBy: null,
  rejectedAt: null,
  materialReturnDeadline: null,
  materialPenaltyApplied: false,
  penaltyAmount: null,
  createdAt: faker.date.recent(),
  updatedAt: faker.date.recent(),
  orderItems: [],
  user: null,
  history: [],
});

export const orderFactory = (args?: Partial<OrderInterface>): OrderInterface =>
  buildFactory<OrderInterface>(buildSchema())(args);
