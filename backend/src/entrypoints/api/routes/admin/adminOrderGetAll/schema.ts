import { z } from '@hono/zod-openapi';

import { ORDER_STATUS_VALUES } from '@/domain/entities/order/orderStatus';
import { OrderStaffListItemSchemaParser } from '@/entrypoints/api/serializers/order.serializer';

export const adminOrderGetAllSchema = {
  query: z.object({
    status: z.enum(ORDER_STATUS_VALUES as unknown as [string, ...string[]]).optional(),
    search: z.string().optional(),
    limit: z.coerce.number().int().min(1).max(100).optional(),
    offset: z.coerce.number().int().min(0).optional(),
    sortBy: z.enum(['createdAt', 'updatedAt', 'totalPrice', 'status', 'deliveryDate']).optional(),
    sortOrder: z.enum(['ASC', 'DESC']).optional(),
  }),
  response: z.object({
    items: z.array(OrderStaffListItemSchemaParser),
    totalCount: z.number(),
  }),
};
