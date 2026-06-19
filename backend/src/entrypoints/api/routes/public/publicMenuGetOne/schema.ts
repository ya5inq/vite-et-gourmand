import { z } from '@hono/zod-openapi';

import { PublicMenuSchemaParser } from '@/entrypoints/api/serializers/menu.serializer';

export const publicMenuGetOneSchema = {
  params: z.object({
    id: z.string().uuid(),
  }),
  response: PublicMenuSchemaParser,
};
