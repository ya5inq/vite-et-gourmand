import { RoleType, UserInterface } from '@/domain/entities/user/user.entity.interface';

export interface UpdateUserDataInterface {
  firstName?: string;
  lastName?: string;
  phone?: string | null;
  address?: string | null;
  city?: string | null;
  postalCode?: string | null;
  role?: RoleType;
  admin?: boolean;
  isActive?: boolean;
}

export interface ExecuteUpdateUserOptions {
  currentUser?: UserInterface;
  userId: string;
  data: UpdateUserDataInterface;
}

export interface UpdateUserUseCaseInterface {
  executeUpdateUser: (options: ExecuteUpdateUserOptions) => Promise<UserInterface>;
}
