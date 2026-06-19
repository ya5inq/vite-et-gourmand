import { createRoute } from '@hono/zod-openapi';

import { GetAllMenusUseCaseInterface } from '@/application/useCases/menu/getAllMenus/getAllMenus.useCase.interface';

import { mainContainer } from '@/configuration/di/mainContainer';
import { TYPES } from '@/configuration/di/types';
import { HttpStatuses } from '@/entrypoints/api/config/httpStatuses';
import { jsonSuccessGetResponse, jsonErrorResponse, AppErrorCodes } from '@/entrypoints/api/helpers/hono.helper';
import { getHonoApp } from '@/entrypoints/api/loader/getHonoApp';
import { MenuSerializer } from '@/entrypoints/api/serializers/menu.serializer';

import { adminMenuGetAllSchema } from './schema';

const adminMenuGetAllRoute = getHonoApp();

const route = createRoute({
  method: 'get',
  path: '/menu',
  request: {
    query: adminMenuGetAllSchema.query,
  },
  tags: ['admin', 'menu'],
  operationId: 'AdminMenuGetAll',
  summary: 'Menu - List (admin)',
  responses: {
    200: jsonSuccessGetResponse(adminMenuGetAllSchema.response),
    401: jsonErrorResponse(AppErrorCodes.UNAUTHORIZED),
    403: jsonErrorResponse(AppErrorCodes.FORBIDDEN),
  },
});

adminMenuGetAllRoute.openapi(route, async (c) => {
  const {
    theme,
    dietaryRegimeId,
    priceMax,
    priceMin,
    maxMinPersons,
    search,
    isAvailable,
    limit,
    offset,
    sortBy,
    sortOrder,
  } = c.req.valid('query');

  const getAllMenusUseCase = mainContainer.get<GetAllMenusUseCaseInterface>(TYPES.GetAllMenusUseCase);
  const { items, totalCount } = await getAllMenusUseCase.executeGetAllMenus({
    theme,
    dietaryRegimeId,
    priceMax,
    priceMin,
    maxMinPersons,
    search,
    isAvailable,
    limit,
    offset,
    sortBy,
    sortOrder,
  });

  return c.json(
    {
      items: items.map((menu) => MenuSerializer.serializeForList(menu)),
      totalCount,
    },
    HttpStatuses.OK,
  );
});

export { adminMenuGetAllRoute };
