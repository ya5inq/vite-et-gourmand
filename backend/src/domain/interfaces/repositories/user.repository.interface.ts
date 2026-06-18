import { RoleType, UserInterface } from '@/domain/entities/user/user.entity.interface';

export type UserSortBy = 'updatedAt' | 'createdAt' | 'email' | 'lastName' | 'firstName';
export type SortOrder = 'ASC' | 'DESC';

export interface FindAllUsersParamsInterface {
  role?: RoleType;
  isActive?: boolean;
  limit?: number;
  offset?: number;
  sortBy?: UserSortBy;
  sortOrder?: SortOrder;
  search?: string;
}

export interface FindAllUsersResultInterface {
  users: UserInterface[];
  totalCount: number;
}

export interface UserRepositoryInterface {
  findByEmail: (email: string) => Promise<UserInterface | null>;
  findById: (id: string) => Promise<UserInterface | null>;
  updateOne: (id: string, data: Partial<UserInterface>) => Promise<void>;
  create: (user: UserInterface) => Promise<void>;
  deleteOne: (id: string) => Promise<void>;
  findAll: (params?: FindAllUsersParamsInterface) => Promise<UserInterface[]>;
  countFindAll: (params?: FindAllUsersParamsInterface) => Promise<number>;
}
