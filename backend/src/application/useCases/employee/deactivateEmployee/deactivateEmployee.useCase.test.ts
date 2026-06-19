import { faker } from '@faker-js/faker';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { RoleType } from '@/domain/entities/user/user.entity.interface';

import { getAuditLogRepositoryMock } from '@/adapters/auditLog/auditLog.repository.mock';
import { getLoggerMock } from '@/adapters/logger/logger.mock';
import { getUserRepositoryMock } from '@/adapters/repositories/userRepository/user.repository.mock';
import { AppError } from '@/application/errors/app.error';
import { userFactory } from '@/domain/entities/user/user.factory';

import { DeactivateEmployeeUseCase } from './deactivateEmployee.useCase';

describe('DeactivateEmployeeUseCase', () => {
  const userRepositoryMock = getUserRepositoryMock();
  const auditLogRepositoryMock = getAuditLogRepositoryMock();
  const loggerMock = getLoggerMock();

  const deactivateEmployeeUseCase = new DeactivateEmployeeUseCase(
    userRepositoryMock,
    auditLogRepositoryMock,
    loggerMock,
  );

  const actor = { actorId: faker.string.uuid(), actorRole: RoleType.ADMIN as string };

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should deactivate an employee', async () => {
    const employee = userFactory({ role: RoleType.EMPLOYEE, isActive: true });
    userRepositoryMock.findById.mockResolvedValue(employee);

    const result = await deactivateEmployeeUseCase.executeDeactivateEmployee({ employeeId: employee.id, ...actor });

    expect(userRepositoryMock.updateOne).toHaveBeenCalledWith(employee.id, { isActive: false });
    expect(result.isActive).toBe(false);
    expect(auditLogRepositoryMock.record).toHaveBeenCalledWith(
      expect.objectContaining({ action: 'EMPLOYEE_DEACTIVATED' }),
    );
  });

  it('should throw NOT_FOUND when the employee does not exist', async () => {
    userRepositoryMock.findById.mockResolvedValue(null);

    await expect(
      deactivateEmployeeUseCase.executeDeactivateEmployee({ employeeId: faker.string.uuid(), ...actor }),
    ).rejects.toThrow(AppError);

    expect(userRepositoryMock.updateOne).not.toHaveBeenCalled();
  });

  it('should refuse to deactivate an admin', async () => {
    const admin = userFactory({ role: RoleType.ADMIN });
    userRepositoryMock.findById.mockResolvedValue(admin);

    await expect(
      deactivateEmployeeUseCase.executeDeactivateEmployee({ employeeId: admin.id, ...actor }),
    ).rejects.toThrow(AppError);

    expect(userRepositoryMock.updateOne).not.toHaveBeenCalled();
  });

  it('should refuse to deactivate a regular user (not an employee)', async () => {
    const user = userFactory({ role: RoleType.USER });
    userRepositoryMock.findById.mockResolvedValue(user);

    await expect(
      deactivateEmployeeUseCase.executeDeactivateEmployee({ employeeId: user.id, ...actor }),
    ).rejects.toThrow(AppError);

    expect(userRepositoryMock.updateOne).not.toHaveBeenCalled();
  });
});
