import { z } from '@hono/zod-openapi';

import { ContactMessageSchemaParser } from '@/entrypoints/api/serializers/contactMessage.serializer';

export const adminContactMessageGetAllSchema = {
  query: z.object({
    isRead: z
      .enum(['true', 'false'])
      .transform((value) => value === 'true')
      .optional(),
    limit: z.coerce.number().int().min(1).max(100).optional(),
    offset: z.coerce.number().int().min(0).optional(),
    sortOrder: z.enum(['ASC', 'DESC']).optional(),
  }),
  response: z.object({
    items: z.array(ContactMessageSchemaParser),
    totalCount: z.number(),
  }),
};
