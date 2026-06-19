import { z } from '@hono/zod-openapi';

import { PublicUserListItemSchemaParser } from '@/entrypoints/api/serializers/user.serializer';

export const adminEmployeeGetAllSchema = {
  query: z.object({
    isActive: z
      .enum(['true', 'false'])
      .transform((value) => value === 'true')
      .optional(),
    search: z.string().optional(),
    limit: z.coerce.number().int().min(1).max(100).optional(),
    offset: z.coerce.number().int().min(0).optional(),
    sortBy: z.enum(['email', 'lastName', 'firstName', 'createdAt', 'updatedAt']).optional(),
    sortOrder: z.enum(['ASC', 'DESC']).optional(),
  }),
  response: z.object({
    items: z.array(PublicUserListItemSchemaParser),
    totalCount: z.number(),
  }),
};
