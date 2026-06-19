import { z } from '@hono/zod-openapi';

import { PublicMenuListItemSchemaParser } from '@/entrypoints/api/serializers/menu.serializer';

export const adminMenuGetAllSchema = {
  query: z.object({
    theme: z.string().optional(),
    dietaryRegimeId: z.string().uuid().optional(),
    priceMax: z.coerce.number().optional(),
    priceMin: z.coerce.number().optional(),
    maxMinPersons: z.coerce.number().int().optional(),
    search: z.string().optional(),
    isAvailable: z
      .enum(['true', 'false'])
      .transform((value) => value === 'true')
      .optional(),
    limit: z.coerce.number().int().min(1).max(100).optional(),
    offset: z.coerce.number().int().min(0).optional(),
    sortBy: z.enum(['name', 'price', 'minPersons', 'createdAt', 'updatedAt']).optional(),
    sortOrder: z.enum(['ASC', 'DESC']).optional(),
  }),
  response: z.object({
    items: z.array(PublicMenuListItemSchemaParser),
    totalCount: z.number(),
  }),
};
