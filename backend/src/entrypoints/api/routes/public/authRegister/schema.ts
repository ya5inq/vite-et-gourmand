import { z } from '@hono/zod-openapi';

import { defaultSuccessResponseSchema } from '@/entrypoints/api/schemas/common.schema';
import { passwordSchema } from '@/infrastructure/utils/zod.utils';

export const authRegisterSchema = {
  body: z.object({
    email: z.string().email().openapi({ example: 'john.doe@example.com' }),
    password: passwordSchema.openapi({ example: 'Password123' }),
    firstName: z.string().min(1).openapi({ example: 'John' }),
    lastName: z.string().min(1).openapi({ example: 'Doe' }),
    phone: z.string().nullable().optional().openapi({ example: '0606060606' }),
    address: z.string().nullable().optional().openapi({ example: '123 Rue de la Paix' }),
    city: z.string().nullable().optional().openapi({ example: 'Paris' }),
    postalCode: z.string().nullable().optional().openapi({ example: '75001' }),
  }),
  response: defaultSuccessResponseSchema,
};
