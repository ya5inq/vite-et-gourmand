import { z } from '@hono/zod-openapi';

export const defaultErrorResponseSchema = z.object({
  message: z.string(),
  code: z.string(),
  errors: z
    .array(
      z.object({
        message: z.string(),
        code: z.string(),
        path: z.array(z.string()),
      }),
    )
    .optional(),
});

export const defaultSuccessResponseSchema = z.object({
  message: z.string(),
  code: z.string(),
});

export const defaultSuccessResponseWithIdSchema = z.object({
  message: z.string(),
  code: z.string(),
  context: z.object({
    id: z.string(),
  }),
});
