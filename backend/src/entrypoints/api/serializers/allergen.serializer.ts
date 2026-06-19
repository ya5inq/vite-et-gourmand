import { z } from 'zod';

import { AllergenInterface } from '@/domain/entities/allergen/allergen.entity.interface';

export const PublicAllergenSchemaParser = z.object({
  id: z.string().uuid(),
  name: z.string(),
  icon: z.string().nullable(),
  createdAt: z.string().datetime(),
});

export type PublicAllergen = z.infer<typeof PublicAllergenSchemaParser>;

export class AllergenSerializer {
  static serialize(allergen: AllergenInterface): PublicAllergen {
    return PublicAllergenSchemaParser.parse({
      id: allergen.id,
      name: allergen.name,
      icon: allergen.icon,
      createdAt: allergen.createdAt.toISOString(),
    });
  }

  static serializeForList(allergen: AllergenInterface): PublicAllergen {
    return AllergenSerializer.serialize(allergen);
  }
}
