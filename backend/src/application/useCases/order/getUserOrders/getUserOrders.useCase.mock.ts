import { vi, Mocked } from 'vitest';

import { GetUserOrdersUseCaseInterface } from './getUserOrders.useCase.interface';

export const getGetUserOrdersUseCaseMock = (): Mocked<GetUserOrdersUseCaseInterface> => ({
  executeGetUserOrders: vi.fn().mockResolvedValue({ items: [], totalCount: 0 }),
});
