import { z } from '@hono/zod-openapi';

import { PublicUserSchemaParser } from '@/entrypoints/api/serializers/user.serializer';

export const userUpdateMeSchema = {
  body: z.object({
    firstName: z.string().min(1).max(100).optional(),
    lastName: z.string().min(1).max(100).optional(),
    phone: z.string().nullable().optional(),
    address: z.string().min(1).nullable().optional(),
    city: z.string().min(1).nullable().optional(),
    postalCode: z.string().nullable().optional(),
  }),
  response: PublicUserSchemaParser,
};
