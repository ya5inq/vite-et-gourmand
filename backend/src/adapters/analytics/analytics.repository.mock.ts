import { vi, type Mocked } from 'vitest';

import { AnalyticsRepositoryInterface } from '@/domain/interfaces/adapters/analytics.repository.interface';

export const getAnalyticsRepositoryMock = (
  overrides: Partial<Mocked<AnalyticsRepositoryInterface>> = {},
): Mocked<AnalyticsRepositoryInterface> => ({
  recordOrderStats: vi.fn(),
  updateOrderStatus: vi.fn(),
  getOrdersByMenu: vi.fn().mockResolvedValue([]),
  getRevenueByMenu: vi.fn().mockResolvedValue([]),
  ...overrides,
});
