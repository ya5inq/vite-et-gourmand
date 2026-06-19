import { z } from '@hono/zod-openapi';

import { PublicDietaryRegimeSchemaParser } from '@/entrypoints/api/serializers/dietaryRegime.serializer';

export const adminDietaryRegimeCreateSchema = {
  body: z.object({
    name: z.string().min(1).max(255),
    description: z.string().nullable().optional(),
  }),
  response: PublicDietaryRegimeSchemaParser,
};
