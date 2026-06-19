import { createRoute } from '@hono/zod-openapi';

import { GetMenuUseCaseInterface } from '@/application/useCases/menu/getMenu/getMenu.useCase.interface';

import { mainContainer } from '@/configuration/di/mainContainer';
import { TYPES } from '@/configuration/di/types';
import { HttpStatuses } from '@/entrypoints/api/config/httpStatuses';
import { jsonSuccessGetResponse, jsonErrorResponse, AppErrorCodes } from '@/entrypoints/api/helpers/hono.helper';
import { getHonoApp } from '@/entrypoints/api/loader/getHonoApp';
import { MenuSerializer } from '@/entrypoints/api/serializers/menu.serializer';

import { publicMenuGetOneSchema } from './schema';

const publicMenuGetOneRoute = getHonoApp();

const route = createRoute({
  method: 'get',
  path: '/menu/{id}',
  request: {
    params: publicMenuGetOneSchema.params,
  },
  tags: ['public', 'menu'],
  operationId: 'PublicMenuGetOne',
  summary: 'Menu - Get a menu detail (public)',
  responses: {
    200: jsonSuccessGetResponse(publicMenuGetOneSchema.response),
    404: jsonErrorResponse(AppErrorCodes.NOT_FOUND_MENU),
  },
});

publicMenuGetOneRoute.openapi(route, async (c) => {
  const { id } = c.req.valid('param');

  const getMenuUseCase = mainContainer.get<GetMenuUseCaseInterface>(TYPES.GetMenuUseCase);
  const menu = await getMenuUseCase.executeGetMenu(id);

  return c.json(MenuSerializer.serialize(menu), HttpStatuses.OK);
});

export { publicMenuGetOneRoute };
