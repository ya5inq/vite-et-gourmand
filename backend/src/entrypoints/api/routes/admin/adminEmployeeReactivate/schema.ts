import { z } from '@hono/zod-openapi';

import { PublicUserSchemaParser } from '@/entrypoints/api/serializers/user.serializer';

export const adminEmployeeReactivateSchema = {
  params: z.object({
    id: z.string().uuid(),
  }),
  response: PublicUserSchemaParser,
};
