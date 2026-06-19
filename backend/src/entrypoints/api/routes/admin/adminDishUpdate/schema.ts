import { z } from '@hono/zod-openapi';

import { DishCategoryValues } from '@/domain/entities/dish/dish.entity.interface';

import { PublicDishSchemaParser } from '@/entrypoints/api/serializers/dish.serializer';

export const adminDishUpdateSchema = {
  params: z.object({
    id: z.string().uuid(),
  }),
  body: z.object({
    name: z.string().min(1).max(255).optional(),
    description: z.string().nullable().optional(),
    category: z.enum(DishCategoryValues).optional(),
    price: z.number().nonnegative().nullable().optional(),
    imageUrl: z.string().nullable().optional(),
    isAvailable: z.boolean().optional(),
    allergenIds: z.array(z.string().uuid()).optional(),
  }),
  response: PublicDishSchemaParser,
};
