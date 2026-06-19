import { z } from '@hono/zod-openapi';

import { DishCategoryValues } from '@/domain/entities/dish/dish.entity.interface';

import { PublicDishListItemSchemaParser } from '@/entrypoints/api/serializers/dish.serializer';

export const adminDishGetAllSchema = {
  query: z.object({
    category: z.enum(DishCategoryValues).optional(),
    isAvailable: z
      .enum(['true', 'false'])
      .transform((value) => value === 'true')
      .optional(),
    search: z.string().optional(),
    limit: z.coerce.number().int().min(1).max(100).optional(),
    offset: z.coerce.number().int().min(0).optional(),
    sortBy: z.enum(['name', 'price', 'category', 'createdAt', 'updatedAt']).optional(),
    sortOrder: z.enum(['ASC', 'DESC']).optional(),
  }),
  response: z.object({
    items: z.array(PublicDishListItemSchemaParser),
    totalCount: z.number(),
  }),
};
