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

const orderHistorySubSchema = z.object({
  id: z.string().uuid(),
  oldStatus: orderStatusEnum.nullable(),
  newStatus: orderStatusEnum,
  changedBy: z.string().uuid().nullable(),
  reason: z.string().nullable(),
  contactMode: z.string().nullable(),
  createdAt: z.string().datetime(),
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

/** Staff-facing list item: includes the customer identity for the admin table. */
export const OrderStaffListItemSchemaParser = OrderListItemSchemaParser.extend({
  userId: z.string().uuid().nullable(),
  guestEmail: z.string().nullable(),
  guestName: z.string().nullable(),
  deliveryCity: z.string().nullable(),
});

/** Staff-facing detail: full order + rejection / penalty fields + history. */
export const OrderDetailSchemaParser = OrderSchemaParser.extend({
  rejectionReason: z.string().nullable(),
  rejectedBy: z.string().uuid().nullable(),
  rejectedAt: z.string().datetime().nullable(),
  materialReturnDeadline: z.string().datetime().nullable(),
  materialPenaltyApplied: z.boolean(),
  penaltyAmount: z.number().nullable(),
  history: z.array(orderHistorySubSchema),
});

export type SerializedOrder = z.infer<typeof OrderSchemaParser>;
export type SerializedOrderListItem = z.infer<typeof OrderListItemSchemaParser>;
export type SerializedOrderStaffListItem = z.infer<typeof OrderStaffListItemSchemaParser>;
export type SerializedOrderDetail = z.infer<typeof OrderDetailSchemaParser>;

/**
 * Serializes a `date` column to `YYYY-MM-DD`. TypeORM returns `date` columns as
 * a plain string on read but the value is a `Date` right after creation, so this
 * helper tolerates both.
 */
const toDateOnly = (date: Date | string | null): string | null => {
  if (!date) {
    return null;
  }
  if (typeof date === 'string') {
    return date.slice(0, 10);
  }
  return date.toISOString().slice(0, 10);
};

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

  static serializeForStaffList(order: OrderInterface): SerializedOrderStaffListItem {
    return OrderStaffListItemSchemaParser.parse({
      id: order.id,
      status: order.status,
      userId: order.userId,
      guestEmail: order.guestEmail,
      guestName: order.guestName,
      deliveryCity: order.deliveryCity,
      deliveryDate: toDateOnly(order.deliveryDate),
      deliveryFee: order.deliveryFee,
      totalPrice: order.totalPrice,
      itemCount: (order.orderItems ?? []).length,
      createdAt: order.createdAt.toISOString(),
    });
  }

  static serializeDetail(order: OrderInterface): SerializedOrderDetail {
    return OrderDetailSchemaParser.parse({
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
      rejectionReason: order.rejectionReason,
      rejectedBy: order.rejectedBy,
      rejectedAt: order.rejectedAt ? order.rejectedAt.toISOString() : null,
      materialReturnDeadline: order.materialReturnDeadline ? order.materialReturnDeadline.toISOString() : null,
      materialPenaltyApplied: order.materialPenaltyApplied,
      penaltyAmount: order.penaltyAmount,
      history: (order.history ?? []).map((entry) => ({
        id: entry.id,
        oldStatus: entry.oldStatus,
        newStatus: entry.newStatus,
        changedBy: entry.changedBy,
        reason: entry.reason,
        contactMode: entry.contactMode,
        createdAt: entry.createdAt.toISOString(),
      })),
    });
  }
}
