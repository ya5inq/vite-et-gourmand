import { vi, Mocked } from 'vitest';

import { GetAllOrdersUseCaseInterface } from './getAllOrders.useCase.interface';

export const getGetAllOrdersUseCaseMock = (): Mocked<GetAllOrdersUseCaseInterface> => ({
  executeGetAllOrders: vi.fn().mockResolvedValue({ items: [], totalCount: 0 }),
});
