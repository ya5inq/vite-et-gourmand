import { inject, injectable } from 'inversify';

import { AppErrorCodes } from '@/application/errors/app.error.interface';
import { RoleType, UserInterface } from '@/domain/entities/user/user.entity.interface';
import { AuditLogRepositoryInterface } from '@/domain/interfaces/adapters/auditLog.repository.interface';
import { LoggerInterface } from '@/domain/interfaces/logger/logger.interface';
import { UserRepositoryInterface } from '@/domain/interfaces/repositories/user.repository.interface';

import { AppError } from '@/application/errors/app.error';
import { TYPES } from '@/configuration/di/types';

import {
  ReactivateEmployeeInputInterface,
  ReactivateEmployeeUseCaseInterface,
} from './reactivateEmployee.useCase.interface';

@injectable()
export class ReactivateEmployeeUseCase implements ReactivateEmployeeUseCaseInterface {
  constructor(
    @inject(TYPES.UserRepository) private userRepository: UserRepositoryInterface,
    @inject(TYPES.AuditLogRepository) private auditLogRepository: AuditLogRepositoryInterface,
    @inject(TYPES.Logger) private logger: LoggerInterface,
  ) {}

  async executeReactivateEmployee({
    employeeId,
    actorId,
    actorRole,
  }: ReactivateEmployeeInputInterface): Promise<UserInterface> {
    const employee = await this.userRepository.findById(employeeId);
    if (!employee) {
      throw new AppError({
        code: AppErrorCodes.NOT_FOUND_USER,
        message: 'User not found',
        privateContext: { employeeId },
      });
    }

    // This route only manages employee accounts.
    if (employee.role !== RoleType.EMPLOYEE) {
      throw new AppError({
        code: AppErrorCodes.BAD_REQUEST_NOT_AN_EMPLOYEE,
        message: 'Target account is not an employee',
        privateContext: { employeeId, role: employee.role },
      });
    }

    await this.userRepository.updateOne(employeeId, { isActive: true });

    await this.auditLogRepository.record({
      entityType: 'user',
      entityId: employeeId,
      action: 'EMPLOYEE_REACTIVATED',
      actorId,
      actorRole,
    });

    this.logger.debug('Employee reactivated', { employeeId });

    return { ...employee, isActive: true };
  }
}
