import { DietaryRegimeInterface } from '@/domain/entities/dietaryRegime/dietaryRegime.entity.interface';

export interface CreateDietaryRegimeDataInterface {
  name: string;
  description?: string | null;
}

export interface CreateDietaryRegimeUseCaseInterface {
  executeCreateDietaryRegime: (data: CreateDietaryRegimeDataInterface) => Promise<DietaryRegimeInterface>;
}
