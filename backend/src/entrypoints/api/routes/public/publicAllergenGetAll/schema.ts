import { z } from '@hono/zod-openapi';

import { PublicAllergenSchemaParser } from '@/entrypoints/api/serializers/allergen.serializer';

export const publicAllergenGetAllSchema = {
  response: z.object({
    items: z.array(PublicAllergenSchemaParser),
    totalCount: z.number(),
  }),
};
