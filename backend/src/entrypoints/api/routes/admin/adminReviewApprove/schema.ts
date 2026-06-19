import { z } from '@hono/zod-openapi';

import { ReviewSchemaParser } from '@/entrypoints/api/serializers/review.serializer';

export const adminReviewApproveSchema = {
  params: z.object({
    id: z.string().uuid(),
  }),
  response: ReviewSchemaParser,
};
