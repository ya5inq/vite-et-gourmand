import { createRoute } from '@hono/zod-openapi';

import { GetMenuUseCaseInterface } from '@/application/useCases/menu/getMenu/getMenu.useCase.interface';

import { mainContainer } from '@/configuration/di/mainContainer';
import { TYPES } from '@/configuration/di/types';
import { HttpStatuses } from '@/entrypoints/api/config/httpStatuses';
import { jsonSuccessGetResponse, jsonErrorResponse, AppErrorCodes } from '@/entrypoints/api/helpers/hono.helper';
import { getHonoApp } from '@/entrypoints/api/loader/getHonoApp';
import { MenuSerializer } from '@/entrypoints/api/serializers/menu.serializer';

import { adminMenuGetOneSchema } from './schema';

const adminMenuGetOneRoute = getHonoApp();

const route = createRoute({
  method: 'get',
  path: '/menu/{id}',
  request: {
    params: adminMenuGetOneSchema.params,
  },
  tags: ['admin', 'menu'],
  operationId: 'AdminMenuGetOne',
  summary: 'Menu - Get one (admin)',
  responses: {
    200: jsonSuccessGetResponse(adminMenuGetOneSchema.response),
    401: jsonErrorResponse(AppErrorCodes.UNAUTHORIZED),
    403: jsonErrorResponse(AppErrorCodes.FORBIDDEN),
    404: jsonErrorResponse(AppErrorCodes.NOT_FOUND_MENU),
  },
});

adminMenuGetOneRoute.openapi(route, async (c) => {
  const { id } = c.req.valid('param');

  const getMenuUseCase = mainContainer.get<GetMenuUseCaseInterface>(TYPES.GetMenuUseCase);
  const menu = await getMenuUseCase.executeGetMenu(id);

  return c.json(MenuSerializer.serialize(menu), HttpStatuses.OK);
});

export { adminMenuGetOneRoute };
