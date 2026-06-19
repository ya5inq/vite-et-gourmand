import { z } from '@hono/zod-openapi';

export const adminContactMessageDeleteSchema = {
  params: z.object({
    id: z.string().uuid(),
  }),
};
