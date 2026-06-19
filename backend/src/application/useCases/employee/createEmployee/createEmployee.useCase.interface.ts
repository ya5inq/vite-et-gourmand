import { UserInterface } from '@/domain/entities/user/user.entity.interface';

export interface CreateEmployeeInputInterface {
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  actorId: string | null;
  actorRole: string | null;
}

export interface CreateEmployeeUseCaseInterface {
  executeCreateEmployee(input: CreateEmployeeInputInterface): Promise<UserInterface>;
}
