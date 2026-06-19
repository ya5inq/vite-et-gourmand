import { beforeEach, describe, expect, it, vi } from 'vitest';

import { getAnalyticsRepositoryMock } from '@/adapters/analytics/analytics.repository.mock';

import { GetOrdersByMenuStatsUseCase } from './getOrdersByMenuStats.useCase';

describe('GetOrdersByMenuStatsUseCase', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should forward the menuId/from/to filter to the analytics repository', async () => {
    const expected = [{ menuId: 'm1', menuName: 'Menu Prestige', orderCount: 3, totalQuantity: 40 }];
    const analyticsRepository = getAnalyticsRepositoryMock({
      getOrdersByMenu: vi.fn().mockResolvedValue(expected),
    });
    const useCase = new GetOrdersByMenuStatsUseCase(analyticsRepository);

    const from = new Date('2026-01-01');
    const to = new Date('2026-06-30');
    const result = await useCase.executeGetOrdersByMenuStats({ menuId: 'm1', from, to });

    expect(result).toEqual(expected);
    expect(analyticsRepository.getOrdersByMenu).toHaveBeenCalledWith({ menuId: 'm1', from, to });
  });

  it('should work without any filter', async () => {
    const analyticsRepository = getAnalyticsRepositoryMock();
    const useCase = new GetOrdersByMenuStatsUseCase(analyticsRepository);

    const result = await useCase.executeGetOrdersByMenuStats({});

    expect(result).toEqual([]);
    expect(analyticsRepository.getOrdersByMenu).toHaveBeenCalledWith({
      menuId: undefined,
      from: undefined,
      to: undefined,
    });
  });
});
