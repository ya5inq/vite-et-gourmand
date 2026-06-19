import { z } from 'zod';

import { OrderInterface } from '@/domain/entities/order/order.entity.interface';

import { ORDER_STATUS_VALUES } from '@/domain/entities/order/orderStatus';

const orderStatusEnum = z.enum(ORDER_STATUS_VALUES as unknown as [string, ...string[]]);

const orderItemSubSchema = z.object({
  id: z.string().uuid(),
  menuId: z.string().uuid(),
  menuName: z.string().nullable(),
  quantity: z.number(),
  unitPrice: z.number(),
  lineTotal: z.number(),
  discountApplied: z.boolean(),
});

export const OrderSchemaParser = z.object({
  id: z.string().uuid(),
  status: orderStatusEnum,
  userId: z.string().uuid().nullable(),
  guestEmail: z.string().nullable(),
  guestName: z.string().nullable(),
  guestPhone: z.string().nullable(),
  deliveryAddress: z.string().nullable(),
  deliveryCity: z.string().nullable(),
  deliveryPostalCode: z.string().nullable(),
  deliveryZoneId: z.string().uuid().nullable(),
  deliveryDate: z.string().nullable(),
  deliveryFee: z.number(),
  totalPrice: z.number(),
  notes: z.string().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  items: z.array(orderItemSubSchema),
});

export const OrderListItemSchemaParser = z.object({
  id: z.string().uuid(),
  status: orderStatusEnum,
  deliveryDate: z.string().nullable(),
  deliveryFee: z.number(),
  totalPrice: z.number(),
  itemCount: z.number(),
  createdAt: z.string().datetime(),
});

export type SerializedOrder = z.infer<typeof OrderSchemaParser>;
export type SerializedOrderListItem = z.infer<typeof OrderListItemSchemaParser>;

const toDateOnly = (date: Date | null): string | null => (date ? date.toISOString().slice(0, 10) : null);

export class OrderSerializer {
  static serialize(order: OrderInterface): SerializedOrder {
    return OrderSchemaParser.parse({
      id: order.id,
      status: order.status,
      userId: order.userId,
      guestEmail: order.guestEmail,
      guestName: order.guestName,
      guestPhone: order.guestPhone,
      deliveryAddress: order.deliveryAddress,
      deliveryCity: order.deliveryCity,
      deliveryPostalCode: order.deliveryPostalCode,
      deliveryZoneId: order.deliveryZoneId,
      deliveryDate: toDateOnly(order.deliveryDate),
      deliveryFee: order.deliveryFee,
      totalPrice: order.totalPrice,
      notes: order.notes,
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
      items: (order.orderItems ?? []).map((item) => ({
        id: item.id,
        menuId: item.menuId,
        menuName: item.menu?.name ?? null,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        lineTotal: item.lineTotal,
        discountApplied: item.discountApplied,
      })),
    });
  }

  static serializeForList(order: OrderInterface): SerializedOrderListItem {
    return OrderListItemSchemaParser.parse({
      id: order.id,
      status: order.status,
      deliveryDate: toDateOnly(order.deliveryDate),
      deliveryFee: order.deliveryFee,
      totalPrice: order.totalPrice,
      itemCount: (order.orderItems ?? []).length,
      createdAt: order.createdAt.toISOString(),
    });
  }
}
