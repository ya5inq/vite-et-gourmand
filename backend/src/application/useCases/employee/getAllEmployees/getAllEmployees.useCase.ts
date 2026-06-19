import { inject, injectable } from 'inversify';

import { RoleType } from '@/domain/entities/user/user.entity.interface';
import { UserRepositoryInterface } from '@/domain/interfaces/repositories/user.repository.interface';

import { TYPES } from '@/configuration/di/types';

import {
  GetAllEmployeesParamsInterface,
  GetAllEmployeesResultInterface,
  GetAllEmployeesUseCaseInterface,
} from './getAllEmployees.useCase.interface';

@injectable()
export class GetAllEmployeesUseCase implements GetAllEmployeesUseCaseInterface {
  constructor(@inject(TYPES.UserRepository) private userRepository: UserRepositoryInterface) {}

  async executeGetAllEmployees(params: GetAllEmployeesParamsInterface): Promise<GetAllEmployeesResultInterface> {
    // The role filter is forced to EMPLOYEE — this endpoint only lists employees.
    const findParams = { ...params, role: RoleType.EMPLOYEE };

    const [items, totalCount] = await Promise.all([
      this.userRepository.findAll(findParams),
      this.userRepository.countFindAll(findParams),
    ]);

    return { items, totalCount };
  }
}
