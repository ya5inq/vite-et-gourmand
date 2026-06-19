import { z } from '@hono/zod-openapi';

import { PublicMenuSchemaParser } from '@/entrypoints/api/serializers/menu.serializer';

export const adminMenuCreateSchema = {
  body: z.object({
    name: z.string().min(1).max(255),
    description: z.string().nullable().optional(),
    theme: z.string().max(255).nullable().optional(),
    price: z.number().nonnegative(),
    minPersons: z.number().int().min(1).optional(),
    maxPersons: z.number().int().min(1).nullable().optional(),
    stock: z.number().int().min(0).nullable().optional(),
    conditions: z.string().nullable().optional(),
    imageUrl: z.string().nullable().optional(),
    isAvailable: z.boolean().optional(),
    dishIds: z.array(z.string().uuid()).optional(),
    dietaryRegimeIds: z.array(z.string().uuid()).optional(),
  }),
  response: PublicMenuSchemaParser,
};
