import { faker } from '@faker-js/faker';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { RoleType } from '@/domain/entities/user/user.entity.interface';

import { getAuditLogRepositoryMock } from '@/adapters/auditLog/auditLog.repository.mock';
import { getLoggerMock } from '@/adapters/logger/logger.mock';
import { getUserRepositoryMock } from '@/adapters/repositories/userRepository/user.repository.mock';
import { AppError } from '@/application/errors/app.error';
import { userFactory } from '@/domain/entities/user/user.factory';

import { ReactivateEmployeeUseCase } from './reactivateEmployee.useCase';

describe('ReactivateEmployeeUseCase', () => {
  const userRepositoryMock = getUserRepositoryMock();
  const auditLogRepositoryMock = getAuditLogRepositoryMock();
  const loggerMock = getLoggerMock();

  const reactivateEmployeeUseCase = new ReactivateEmployeeUseCase(
    userRepositoryMock,
    auditLogRepositoryMock,
    loggerMock,
  );

  const actor = { actorId: faker.string.uuid(), actorRole: RoleType.ADMIN as string };

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should reactivate an employee', async () => {
    const employee = userFactory({ role: RoleType.EMPLOYEE, isActive: false });
    userRepositoryMock.findById.mockResolvedValue(employee);

    const result = await reactivateEmployeeUseCase.executeReactivateEmployee({ employeeId: employee.id, ...actor });

    expect(userRepositoryMock.updateOne).toHaveBeenCalledWith(employee.id, { isActive: true });
    expect(result.isActive).toBe(true);
    expect(auditLogRepositoryMock.record).toHaveBeenCalledWith(
      expect.objectContaining({ action: 'EMPLOYEE_REACTIVATED' }),
    );
  });

  it('should throw NOT_FOUND when the employee does not exist', async () => {
    userRepositoryMock.findById.mockResolvedValue(null);

    await expect(
      reactivateEmployeeUseCase.executeReactivateEmployee({ employeeId: faker.string.uuid(), ...actor }),
    ).rejects.toThrow(AppError);

    expect(userRepositoryMock.updateOne).not.toHaveBeenCalled();
  });

  it('should refuse to reactivate a non-employee account', async () => {
    const user = userFactory({ role: RoleType.USER });
    userRepositoryMock.findById.mockResolvedValue(user);

    await expect(
      reactivateEmployeeUseCase.executeReactivateEmployee({ employeeId: user.id, ...actor }),
    ).rejects.toThrow(AppError);

    expect(userRepositoryMock.updateOne).not.toHaveBeenCalled();
  });
});
