import { z } from '@hono/zod-openapi';

export const adminReviewDeleteSchema = {
  params: z.object({
    id: z.string().uuid(),
  }),
};
