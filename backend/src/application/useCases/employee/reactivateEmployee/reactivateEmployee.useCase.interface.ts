import { UserInterface } from '@/domain/entities/user/user.entity.interface';

export interface ReactivateEmployeeInputInterface {
  employeeId: string;
  actorId: string | null;
  actorRole: string | null;
}

export interface ReactivateEmployeeUseCaseInterface {
  executeReactivateEmployee(input: ReactivateEmployeeInputInterface): Promise<UserInterface>;
}
