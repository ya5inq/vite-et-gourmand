import { z } from '@hono/zod-openapi';

import { ReviewSchemaParser } from '@/entrypoints/api/serializers/review.serializer';

export const protectedReviewGetMineSchema = {
  response: z.object({
    items: z.array(ReviewSchemaParser),
  }),
};
