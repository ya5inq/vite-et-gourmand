import { z } from '@hono/zod-openapi';

import { OrderSchemaParser } from '@/entrypoints/api/serializers/order.serializer';

export const protectedOrderGetOneSchema = {
  params: z.object({
    id: z.string().uuid(),
  }),
  response: OrderSchemaParser,
};
