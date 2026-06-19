import { z } from 'zod';

import { DietaryRegimeInterface } from '@/domain/entities/dietaryRegime/dietaryRegime.entity.interface';

export const PublicDietaryRegimeSchemaParser = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string().nullable(),
  createdAt: z.string().datetime(),
});

export type PublicDietaryRegime = z.infer<typeof PublicDietaryRegimeSchemaParser>;

export class DietaryRegimeSerializer {
  static serialize(regime: DietaryRegimeInterface): PublicDietaryRegime {
    return PublicDietaryRegimeSchemaParser.parse({
      id: regime.id,
      name: regime.name,
      description: regime.description,
      createdAt: regime.createdAt.toISOString(),
    });
  }

  static serializeForList(regime: DietaryRegimeInterface): PublicDietaryRegime {
    return DietaryRegimeSerializer.serialize(regime);
  }
}
