import { createRoute } from '@hono/zod-openapi';

import { GetOrdersByMenuStatsUseCaseInterface } from '@/application/useCases/stats/getOrdersByMenuStats/getOrdersByMenuStats.useCase.interface';

import { mainContainer } from '@/configuration/di/mainContainer';
import { TYPES } from '@/configuration/di/types';
import { HttpStatuses } from '@/entrypoints/api/config/httpStatuses';
import { jsonSuccessGetResponse, jsonErrorResponse, AppErrorCodes } from '@/entrypoints/api/helpers/hono.helper';
import { getHonoApp } from '@/entrypoints/api/loader/getHonoApp';

import { adminStatsOrdersByMenuSchema } from './schema';

const adminStatsOrdersByMenuRoute = getHonoApp();

const route = createRoute({
  method: 'get',
  path: '/stats/orders-by-menu',
  request: {
    query: adminStatsOrdersByMenuSchema.query,
  },
  tags: ['admin', 'stats'],
  operationId: 'AdminStatsOrdersByMenu',
  summary: 'Stats - Orders by menu (admin)',
  responses: {
    200: jsonSuccessGetResponse(adminStatsOrdersByMenuSchema.response),
    401: jsonErrorResponse(AppErrorCodes.UNAUTHORIZED),
    403: jsonErrorResponse(AppErrorCodes.FORBIDDEN),
  },
});

adminStatsOrdersByMenuRoute.openapi(route, async (c) => {
  const { menuId, from, to } = c.req.valid('query');

  const useCase = mainContainer.get<GetOrdersByMenuStatsUseCaseInterface>(TYPES.GetOrdersByMenuStatsUseCase);
  const items = await useCase.executeGetOrdersByMenuStats({ menuId, from, to });

  return c.json({ items }, HttpStatuses.OK);
});

export { adminStatsOrdersByMenuRoute };
