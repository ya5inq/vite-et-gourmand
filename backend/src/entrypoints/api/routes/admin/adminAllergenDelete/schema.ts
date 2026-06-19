import { z } from '@hono/zod-openapi';

export const adminAllergenDeleteSchema = {
  params: z.object({
    id: z.string().uuid(),
  }),
};
