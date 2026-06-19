import { z } from 'zod';

import { DishInterface, DishCategoryValues } from '@/domain/entities/dish/dish.entity.interface';

const allergenSubSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  icon: z.string().nullable(),
});

export const PublicDishSchemaParser = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string().nullable(),
  category: z.enum(DishCategoryValues),
  price: z.number().nullable(),
  imageUrl: z.string().nullable(),
  isAvailable: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  allergens: z.array(allergenSubSchema),
});

export const PublicDishListItemSchemaParser = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string().nullable(),
  category: z.enum(DishCategoryValues),
  price: z.number().nullable(),
  imageUrl: z.string().nullable(),
  isAvailable: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type PublicDish = z.infer<typeof PublicDishSchemaParser>;
export type PublicDishListItem = z.infer<typeof PublicDishListItemSchemaParser>;

export class DishSerializer {
  static serialize(dish: DishInterface): PublicDish {
    return PublicDishSchemaParser.parse({
      id: dish.id,
      name: dish.name,
      description: dish.description,
      category: dish.category,
      price: dish.price,
      imageUrl: dish.imageUrl,
      isAvailable: dish.isAvailable,
      createdAt: dish.createdAt.toISOString(),
      updatedAt: dish.updatedAt.toISOString(),
      allergens: (dish.allergens ?? []).map((allergen) => ({
        id: allergen.id,
        name: allergen.name,
        icon: allergen.icon,
      })),
    });
  }

  static serializeForList(dish: DishInterface): PublicDishListItem {
    return PublicDishListItemSchemaParser.parse({
      id: dish.id,
      name: dish.name,
      description: dish.description,
      category: dish.category,
      price: dish.price,
      imageUrl: dish.imageUrl,
      isAvailable: dish.isAvailable,
      createdAt: dish.createdAt.toISOString(),
      updatedAt: dish.updatedAt.toISOString(),
    });
  }
}
