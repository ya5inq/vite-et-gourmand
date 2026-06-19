import { createRoute } from '@hono/zod-openapi';

import { GetRevenueByMenuStatsUseCaseInterface } from '@/application/useCases/stats/getRevenueByMenuStats/getRevenueByMenuStats.useCase.interface';

import { mainContainer } from '@/configuration/di/mainContainer';
import { TYPES } from '@/configuration/di/types';
import { HttpStatuses } from '@/entrypoints/api/config/httpStatuses';
import { jsonSuccessGetResponse, jsonErrorResponse, AppErrorCodes } from '@/entrypoints/api/helpers/hono.helper';
import { getHonoApp } from '@/entrypoints/api/loader/getHonoApp';

import { adminStatsRevenueByMenuSchema } from './schema';

const adminStatsRevenueByMenuRoute = getHonoApp();

const route = createRoute({
  method: 'get',
  path: '/stats/revenue-by-menu',
  request: {
    query: adminStatsRevenueByMenuSchema.query,
  },
  tags: ['admin', 'stats'],
  operationId: 'AdminStatsRevenueByMenu',
  summary: 'Stats - Revenue by menu (admin)',
  responses: {
    200: jsonSuccessGetResponse(adminStatsRevenueByMenuSchema.response),
    401: jsonErrorResponse(AppErrorCodes.UNAUTHORIZED),
    403: jsonErrorResponse(AppErrorCodes.FORBIDDEN),
  },
});

adminStatsRevenueByMenuRoute.openapi(route, async (c) => {
  const { menuId, from, to } = c.req.valid('query');

  const useCase = mainContainer.get<GetRevenueByMenuStatsUseCaseInterface>(TYPES.GetRevenueByMenuStatsUseCase);
  const items = await useCase.executeGetRevenueByMenuStats({ menuId, from, to });

  return c.json({ items }, HttpStatuses.OK);
});

export { adminStatsRevenueByMenuRoute };
