import { z } from '@hono/zod-openapi';

import { PublicDietaryRegimeSchemaParser } from '@/entrypoints/api/serializers/dietaryRegime.serializer';

export const adminDietaryRegimeUpdateSchema = {
  params: z.object({
    id: z.string().uuid(),
  }),
  body: z.object({
    name: z.string().min(1).max(255).optional(),
    description: z.string().nullable().optional(),
  }),
  response: PublicDietaryRegimeSchemaParser,
};
