import { z } from '@hono/zod-openapi';

import { passwordSchema } from '@/infrastructure/utils/zod.utils';

export const authResetPasswordBodySchema = z.object({
  token: z.string().min(1),
  password: passwordSchema,
});

export const authResetPasswordResponseSchema = z
  .object({
    code: z.string(),
    message: z.string(),
  })
  .openapi('ResetPasswordResponse');
