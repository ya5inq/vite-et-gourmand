import { z } from '@hono/zod-openapi';

import { OrderDetailSchemaParser } from '@/entrypoints/api/serializers/order.serializer';

export const adminOrderGetOneSchema = {
  params: z.object({
    id: z.string().uuid(),
  }),
  response: OrderDetailSchemaParser,
};
