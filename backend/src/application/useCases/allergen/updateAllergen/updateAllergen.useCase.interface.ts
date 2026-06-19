import { AllergenInterface } from '@/domain/entities/allergen/allergen.entity.interface';

export interface UpdateAllergenDataInterface {
  name?: string;
  icon?: string | null;
}

export interface ExecuteUpdateAllergenOptions {
  id: string;
  data: UpdateAllergenDataInterface;
}

export interface UpdateAllergenUseCaseInterface {
  executeUpdateAllergen: (options: ExecuteUpdateAllergenOptions) => Promise<AllergenInterface>;
}
