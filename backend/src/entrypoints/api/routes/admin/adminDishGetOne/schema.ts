import { z } from '@hono/zod-openapi';

import { PublicDishSchemaParser } from '@/entrypoints/api/serializers/dish.serializer';

export const adminDishGetOneSchema = {
  params: z.object({
    id: z.string().uuid(),
  }),
  response: PublicDishSchemaParser,
};
