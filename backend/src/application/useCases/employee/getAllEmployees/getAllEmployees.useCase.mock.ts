import { Mocked, vi } from 'vitest';

import { GetAllEmployeesUseCaseInterface } from './getAllEmployees.useCase.interface';

export const getGetAllEmployeesUseCaseMock = (): Mocked<GetAllEmployeesUseCaseInterface> => ({
  executeGetAllEmployees: vi.fn().mockResolvedValue({ items: [], totalCount: 0 }),
});
