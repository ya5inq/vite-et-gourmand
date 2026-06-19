import { z } from '@hono/zod-openapi';

import { PublicReviewSchemaParser } from '@/entrypoints/api/serializers/review.serializer';

export const publicReviewGetApprovedSchema = {
  query: z.object({
    limit: z.coerce.number().int().min(1).max(50).optional(),
  }),
  response: z.object({
    items: z.array(PublicReviewSchemaParser),
  }),
};
