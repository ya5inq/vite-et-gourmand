import { beforeEach, describe, expect, it, vi } from 'vitest';

import { getAnalyticsRepositoryMock } from '@/adapters/analytics/analytics.repository.mock';

import { GetRevenueByMenuStatsUseCase } from './getRevenueByMenuStats.useCase';

describe('GetRevenueByMenuStatsUseCase', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should forward the menuId/from/to filter to the analytics repository', async () => {
    const expected = [{ menuId: 'm1', menuName: 'Menu Prestige', revenue: 1700 }];
    const analyticsRepository = getAnalyticsRepositoryMock({
      getRevenueByMenu: vi.fn().mockResolvedValue(expected),
    });
    const useCase = new GetRevenueByMenuStatsUseCase(analyticsRepository);

    const from = new Date('2026-01-01');
    const to = new Date('2026-06-30');
    const result = await useCase.executeGetRevenueByMenuStats({ menuId: 'm1', from, to });

    expect(result).toEqual(expected);
    expect(analyticsRepository.getRevenueByMenu).toHaveBeenCalledWith({ menuId: 'm1', from, to });
  });

  it('should work without any filter', async () => {
    const analyticsRepository = getAnalyticsRepositoryMock();
    const useCase = new GetRevenueByMenuStatsUseCase(analyticsRepository);

    const result = await useCase.executeGetRevenueByMenuStats({});

    expect(result).toEqual([]);
    expect(analyticsRepository.getRevenueByMenu).toHaveBeenCalledWith({
      menuId: undefined,
      from: undefined,
      to: undefined,
    });
  });
});
