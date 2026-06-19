import { z } from '@hono/zod-openapi';

export const adminDishDeleteSchema = {
  params: z.object({
    id: z.string().uuid(),
  }),
};
