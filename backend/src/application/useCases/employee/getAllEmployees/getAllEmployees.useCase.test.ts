import { afterEach, describe, expect, it, vi } from 'vitest';

import { RoleType } from '@/domain/entities/user/user.entity.interface';

import { getUserRepositoryMock } from '@/adapters/repositories/userRepository/user.repository.mock';
import { userFactory } from '@/domain/entities/user/user.factory';

import { GetAllEmployeesUseCase } from './getAllEmployees.useCase';

describe('GetAllEmployeesUseCase', () => {
  const userRepositoryMock = getUserRepositoryMock();
  const getAllEmployeesUseCase = new GetAllEmployeesUseCase(userRepositoryMock);

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should list employees forcing the EMPLOYEE role filter', async () => {
    const employees = [userFactory({ role: RoleType.EMPLOYEE }), userFactory({ role: RoleType.EMPLOYEE })];
    userRepositoryMock.findAll.mockResolvedValue(employees);
    userRepositoryMock.countFindAll.mockResolvedValue(employees.length);

    const result = await getAllEmployeesUseCase.executeGetAllEmployees({ search: 'jo' });

    expect(userRepositoryMock.findAll).toHaveBeenCalledWith(
      expect.objectContaining({ role: RoleType.EMPLOYEE, search: 'jo' }),
    );
    expect(userRepositoryMock.countFindAll).toHaveBeenCalledWith(expect.objectContaining({ role: RoleType.EMPLOYEE }));
    expect(result).toEqual({ items: employees, totalCount: employees.length });
  });
});
