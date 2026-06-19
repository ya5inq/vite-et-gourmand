import { UserInterface } from '@/domain/entities/user/user.entity.interface';
import { SortOrder, UserSortBy } from '@/domain/interfaces/repositories/user.repository.interface';

export interface GetAllEmployeesParamsInterface {
  isActive?: boolean;
  search?: string;
  limit?: number;
  offset?: number;
  sortBy?: UserSortBy;
  sortOrder?: SortOrder;
}

export interface GetAllEmployeesResultInterface {
  items: UserInterface[];
  totalCount: number;
}

export interface GetAllEmployeesUseCaseInterface {
  executeGetAllEmployees(params: GetAllEmployeesParamsInterface): Promise<GetAllEmployeesResultInterface>;
}
