import { z } from '@hono/zod-openapi';

export const authLoginSchema = {
  body: z.object({
    email: z.string().email(),
    password: z.string().min(1),
  }),
  response: z.object({
    accessToken: z.string(),
  }),
};
