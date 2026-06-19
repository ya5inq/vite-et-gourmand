import { z } from '@hono/zod-openapi';

import { PublicAllergenSchemaParser } from '@/entrypoints/api/serializers/allergen.serializer';

export const adminAllergenUpdateSchema = {
  params: z.object({
    id: z.string().uuid(),
  }),
  body: z.object({
    name: z.string().min(1).max(255).optional(),
    icon: z.string().max(255).nullable().optional(),
  }),
  response: PublicAllergenSchemaParser,
};
