import { AllergenInterface } from '@/domain/entities/allergen/allergen.entity.interface';

export interface CreateAllergenDataInterface {
  name: string;
  icon?: string | null;
}

export interface CreateAllergenUseCaseInterface {
  executeCreateAllergen: (data: CreateAllergenDataInterface) => Promise<AllergenInterface>;
}
