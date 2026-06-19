import { z } from '@hono/zod-openapi';

import { PublicAllergenSchemaParser } from '@/entrypoints/api/serializers/allergen.serializer';

export const adminAllergenGetAllSchema = {
  query: z.object({
    search: z.string().optional(),
    limit: z.coerce.number().int().min(1).max(100).optional(),
    offset: z.coerce.number().int().min(0).optional(),
    sortBy: z.enum(['name', 'createdAt']).optional(),
    sortOrder: z.enum(['ASC', 'DESC']).optional(),
  }),
  response: z.object({
    items: z.array(PublicAllergenSchemaParser),
    totalCount: z.number(),
  }),
};
