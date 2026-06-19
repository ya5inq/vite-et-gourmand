import { z } from '@hono/zod-openapi';

import { passwordSchema } from '@/infrastructure/utils/zod.utils';

export const authSetEmployeePasswordBodySchema = z.object({
  token: z.string().min(1),
  newPassword: passwordSchema,
});

export const authSetEmployeePasswordResponseSchema = z
  .object({
    code: z.string(),
    message: z.string(),
  })
  .openapi('SetEmployeePasswordResponse');
