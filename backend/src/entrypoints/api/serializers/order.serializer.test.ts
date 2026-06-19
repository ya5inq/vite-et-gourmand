import { describe, expect, it } from 'vitest';

import { orderFactory } from '@/domain/entities/order/order.factory';

import { OrderSerializer } from './order.serializer';

describe('OrderSerializer - deliveryDate', () => {
  it('serializes a Date deliveryDate to YYYY-MM-DD', () => {
    const order = orderFactory({ deliveryDate: new Date('2026-07-03T00:00:00.000Z') });

    const result = OrderSerializer.serialize(order);

    expect(result.deliveryDate).toBe('2026-07-03');
  });

  it('serializes a string deliveryDate (as returned by TypeORM date columns)', () => {
    // TypeORM returns `date` columns as a plain string on read; the serializer
    // must not call .toISOString() on it.
    const order = orderFactory({ deliveryDate: '2026-07-03' as unknown as Date });

    const result = OrderSerializer.serialize(order);

    expect(result.deliveryDate).toBe('2026-07-03');
  });

  it('serializes a null deliveryDate to null', () => {
    const order = orderFactory({ deliveryDate: null });

    const result = OrderSerializer.serialize(order);

    expect(result.deliveryDate).toBeNull();
  });
});
