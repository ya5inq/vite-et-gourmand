import { z } from 'zod';

import { DishCategoryValues } from '@/domain/entities/dish/dish.entity.interface';
import { MenuInterface } from '@/domain/entities/menu/menu.entity.interface';

const allergenSubSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  icon: z.string().nullable(),
});

const menuDishSubSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  category: z.enum(DishCategoryValues),
  description: z.string().nullable(),
  price: z.number().nullable(),
  allergens: z.array(allergenSubSchema),
});

const dietaryRegimeSubSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
});

export const PublicMenuSchemaParser = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string().nullable(),
  theme: z.string().nullable(),
  price: z.number(),
  minPersons: z.number(),
  maxPersons: z.number().nullable(),
  stock: z.number().nullable(),
  conditions: z.string().nullable(),
  imageUrl: z.string().nullable(),
  isAvailable: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  dishes: z.array(menuDishSubSchema),
  dietaryRegimes: z.array(dietaryRegimeSubSchema),
});

export const PublicMenuListItemSchemaParser = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string().nullable(),
  theme: z.string().nullable(),
  price: z.number(),
  minPersons: z.number(),
  maxPersons: z.number().nullable(),
  stock: z.number().nullable(),
  isAvailable: z.boolean(),
  imageUrl: z.string().nullable(),
  dietaryRegimes: z.array(dietaryRegimeSubSchema),
});

export type PublicMenu = z.infer<typeof PublicMenuSchemaParser>;
export type PublicMenuListItem = z.infer<typeof PublicMenuListItemSchemaParser>;

export class MenuSerializer {
  static serialize(menu: MenuInterface): PublicMenu {
    return PublicMenuSchemaParser.parse({
      id: menu.id,
      name: menu.name,
      description: menu.description,
      theme: menu.theme,
      price: menu.price,
      minPersons: menu.minPersons,
      maxPersons: menu.maxPersons,
      stock: menu.stock,
      conditions: menu.conditions,
      imageUrl: menu.imageUrl,
      isAvailable: menu.isAvailable,
      createdAt: menu.createdAt.toISOString(),
      updatedAt: menu.updatedAt.toISOString(),
      dishes: (menu.dishes ?? []).map((dish) => ({
        id: dish.id,
        name: dish.name,
        category: dish.category,
        description: dish.description,
        price: dish.price,
        allergens: (dish.allergens ?? []).map((allergen) => ({
          id: allergen.id,
          name: allergen.name,
          icon: allergen.icon,
        })),
      })),
      dietaryRegimes: (menu.dietaryRegimes ?? []).map((regime) => ({
        id: regime.id,
        name: regime.name,
      })),
    });
  }

  static serializeForList(menu: MenuInterface): PublicMenuListItem {
    return PublicMenuListItemSchemaParser.parse({
      id: menu.id,
      name: menu.name,
      description: menu.description,
      theme: menu.theme,
      price: menu.price,
      minPersons: menu.minPersons,
      maxPersons: menu.maxPersons,
      stock: menu.stock,
      isAvailable: menu.isAvailable,
      imageUrl: menu.imageUrl,
      dietaryRegimes: (menu.dietaryRegimes ?? []).map((regime) => ({
        id: regime.id,
        name: regime.name,
      })),
    });
  }
}
