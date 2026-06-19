import { z } from '@hono/zod-openapi';

import { ORDER_STATUS_VALUES } from '@/domain/entities/order/orderStatus';
import { OrderListItemSchemaParser } from '@/entrypoints/api/serializers/order.serializer';

export const protectedOrderGetAllSchema = {
  query: z.object({
    status: z.enum(ORDER_STATUS_VALUES as unknown as [string, ...string[]]).optional(),
    limit: z.coerce.number().int().min(1).max(100).optional(),
    offset: z.coerce.number().int().min(0).optional(),
    sortBy: z.enum(['createdAt', 'updatedAt', 'totalPrice', 'status', 'deliveryDate']).optional(),
    sortOrder: z.enum(['ASC', 'DESC']).optional(),
  }),
  response: z.object({
    items: z.array(OrderListItemSchemaParser),
    totalCount: z.number(),
  }),
};
