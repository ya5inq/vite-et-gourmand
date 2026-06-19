import { z } from '@hono/zod-openapi';

import { PublicUserSchemaParser } from '@/entrypoints/api/serializers/user.serializer';

export const adminEmployeeDeactivateSchema = {
  params: z.object({
    id: z.string().uuid(),
  }),
  response: PublicUserSchemaParser,
};
