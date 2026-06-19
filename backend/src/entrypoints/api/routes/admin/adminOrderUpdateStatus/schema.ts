import { z } from '@hono/zod-openapi';

import { ORDER_CONTACT_MODE_VALUES } from '@/domain/entities/order/orderContactMode';
import { ORDER_STATUS_VALUES } from '@/domain/entities/order/orderStatus';
import { OrderDetailSchemaParser } from '@/entrypoints/api/serializers/order.serializer';

export const adminOrderUpdateStatusSchema = {
  params: z.object({
    id: z.string().uuid(),
  }),
  body: z.object({
    newStatus: z.enum(ORDER_STATUS_VALUES as unknown as [string, ...string[]]),
    reason: z.string().min(1).optional(),
    contactMode: z.enum(ORDER_CONTACT_MODE_VALUES as unknown as [string, ...string[]]).optional(),
  }),
  response: OrderDetailSchemaParser,
};
