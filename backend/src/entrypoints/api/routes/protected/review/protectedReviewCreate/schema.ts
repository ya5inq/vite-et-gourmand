import { z } from '@hono/zod-openapi';

import { ReviewSchemaParser } from '@/entrypoints/api/serializers/review.serializer';

export const protectedReviewCreateSchema = {
  body: z.object({
    orderId: z.string().uuid(),
    rating: z.number().int().min(1).max(5),
    comment: z.string().max(2000).optional(),
  }),
  response: ReviewSchemaParser,
};
