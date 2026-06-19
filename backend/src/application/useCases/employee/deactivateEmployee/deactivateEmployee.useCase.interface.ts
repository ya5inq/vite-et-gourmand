import { UserInterface } from '@/domain/entities/user/user.entity.interface';

export interface DeactivateEmployeeInputInterface {
  employeeId: string;
  actorId: string | null;
  actorRole: string | null;
}

export interface DeactivateEmployeeUseCaseInterface {
  executeDeactivateEmployee(input: DeactivateEmployeeInputInterface): Promise<UserInterface>;
}
