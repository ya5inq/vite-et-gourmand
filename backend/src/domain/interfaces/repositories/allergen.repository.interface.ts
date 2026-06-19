import { AllergenInterface } from '@/domain/entities/allergen/allergen.entity.interface';

export type SortOrder = 'ASC' | 'DESC';
export type AllergenSortBy = 'name' | 'createdAt';

export interface FindAllAllergensParamsInterface {
  search?: string;
  limit?: number;
  offset?: number;
  sortBy?: AllergenSortBy;
  sortOrder?: SortOrder;
}

export interface AllergenRepositoryInterface {
  findById: (id: string) => Promise<AllergenInterface | null>;
  findByIds: (ids: string[]) => Promise<AllergenInterface[]>;
  findAll: (params?: FindAllAllergensParamsInterface) => Promise<AllergenInterface[]>;
  countFindAll: (params?: FindAllAllergensParamsInterface) => Promise<number>;
  create: (allergen: AllergenInterface) => Promise<AllergenInterface>;
  updateOne: (id: string, data: Partial<AllergenInterface>) => Promise<void>;
  deleteOne: (id: string) => Promise<void>;
}
