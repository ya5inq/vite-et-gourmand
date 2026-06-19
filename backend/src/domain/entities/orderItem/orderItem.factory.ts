import { faker } from '@faker-js/faker';

import { buildFactory } from '@/configuration/utils/buildFactory';

import { OrderItemInterface } from './orderItem.entity.interface';

const buildSchema = (): OrderItemInterface => {
  const quantity = faker.number.int({ min: 8, max: 30 });
  const unitPrice = parseFloat(faker.commerce.price({ min: 35, max: 90 }));
  return {
    id: faker.string.uuid(),
    orderId: faker.string.uuid(),
    menuId: faker.string.uuid(),
    quantity,
    unitPrice,
    lineTotal: Math.round(unitPrice * quantity * 100) / 100,
    discountApplied: false,
    createdAt: faker.date.recent(),
    menu: null,
  };
};

export const orderItemFactory = (args?: Partial<OrderItemInterface>): OrderItemInterface =>
  buildFactory<OrderItemInterface>(buildSchema())(args);
