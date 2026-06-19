import { AllergenInterface } from '@/domain/entities/allergen/allergen.entity.interface';
import { FindAllAllergensParamsInterface } from '@/domain/interfaces/repositories/allergen.repository.interface';

export interface GetAllAllergensResultInterface {
  items: AllergenInterface[];
  totalCount: number;
}

export interface GetAllAllergensUseCaseInterface {
  executeGetAllAllergens: (params?: FindAllAllergensParamsInterface) => Promise<GetAllAllergensResultInterface>;
}
