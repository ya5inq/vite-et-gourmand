import { DietaryRegimeInterface } from '@/domain/entities/dietaryRegime/dietaryRegime.entity.interface';

export interface UpdateDietaryRegimeDataInterface {
  name?: string;
  description?: string | null;
}

export interface ExecuteUpdateDietaryRegimeOptions {
  id: string;
  data: UpdateDietaryRegimeDataInterface;
}

export interface UpdateDietaryRegimeUseCaseInterface {
  executeUpdateDietaryRegime: (options: ExecuteUpdateDietaryRegimeOptions) => Promise<DietaryRegimeInterface>;
}
