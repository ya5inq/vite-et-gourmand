import { z } from '@hono/zod-openapi';

import { ReviewSchemaParser } from '@/entrypoints/api/serializers/review.serializer';

export const adminReviewGetAllSchema = {
  query: z.object({
    isApproved: z
      .enum(['true', 'false'])
      .transform((value) => value === 'true')
      .optional(),
    limit: z.coerce.number().int().min(1).max(100).optional(),
    offset: z.coerce.number().int().min(0).optional(),
    sortBy: z.enum(['createdAt', 'updatedAt', 'rating']).optional(),
    sortOrder: z.enum(['ASC', 'DESC']).optional(),
  }),
  response: z.object({
    items: z.array(ReviewSchemaParser),
    totalCount: z.number(),
  }),
};
