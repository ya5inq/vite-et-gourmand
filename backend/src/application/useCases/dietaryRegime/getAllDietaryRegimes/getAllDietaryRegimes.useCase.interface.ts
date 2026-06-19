import { DietaryRegimeInterface } from '@/domain/entities/dietaryRegime/dietaryRegime.entity.interface';
import { FindAllDietaryRegimesParamsInterface } from '@/domain/interfaces/repositories/dietaryRegime.repository.interface';

export interface GetAllDietaryRegimesResultInterface {
  items: DietaryRegimeInterface[];
  totalCount: number;
}

export interface GetAllDietaryRegimesUseCaseInterface {
  executeGetAllDietaryRegimes: (
    params?: FindAllDietaryRegimesParamsInterface,
  ) => Promise<GetAllDietaryRegimesResultInterface>;
}
