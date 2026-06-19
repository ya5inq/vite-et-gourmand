import { DietaryRegimeInterface } from '@/domain/entities/dietaryRegime/dietaryRegime.entity.interface';

export type SortOrder = 'ASC' | 'DESC';
export type DietaryRegimeSortBy = 'name' | 'createdAt';

export interface FindAllDietaryRegimesParamsInterface {
  search?: string;
  limit?: number;
  offset?: number;
  sortBy?: DietaryRegimeSortBy;
  sortOrder?: SortOrder;
}

export interface DietaryRegimeRepositoryInterface {
  findById: (id: string) => Promise<DietaryRegimeInterface | null>;
  findByIds: (ids: string[]) => Promise<DietaryRegimeInterface[]>;
  findAll: (params?: FindAllDietaryRegimesParamsInterface) => Promise<DietaryRegimeInterface[]>;
  countFindAll: (params?: FindAllDietaryRegimesParamsInterface) => Promise<number>;
  create: (dietaryRegime: DietaryRegimeInterface) => Promise<DietaryRegimeInterface>;
  updateOne: (id: string, data: Partial<DietaryRegimeInterface>) => Promise<void>;
  deleteOne: (id: string) => Promise<void>;
}
