import { z } from '@hono/zod-openapi';

import { PublicUserSchemaParser } from '@/entrypoints/api/serializers/user.serializer';

export const adminEmployeeCreateSchema = {
  body: z.object({
    email: z.string().email(),
    firstName: z.string().min(1).max(255),
    lastName: z.string().min(1).max(255),
    phone: z.string().min(1).max(50).nullable().optional(),
  }),
  response: PublicUserSchemaParser,
};
