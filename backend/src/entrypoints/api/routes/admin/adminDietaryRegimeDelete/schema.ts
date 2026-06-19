import { z } from '@hono/zod-openapi';

export const adminDietaryRegimeDeleteSchema = {
  params: z.object({
    id: z.string().uuid(),
  }),
};
