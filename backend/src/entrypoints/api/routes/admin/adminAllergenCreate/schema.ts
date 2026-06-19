import { z } from '@hono/zod-openapi';

import { PublicAllergenSchemaParser } from '@/entrypoints/api/serializers/allergen.serializer';

export const adminAllergenCreateSchema = {
  body: z.object({
    name: z.string().min(1).max(255),
    icon: z.string().max(255).nullable().optional(),
  }),
  response: PublicAllergenSchemaParser,
};
