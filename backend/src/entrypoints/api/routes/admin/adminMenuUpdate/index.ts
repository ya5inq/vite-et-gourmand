import { createRoute } from '@hono/zod-openapi';

import { UpdateMenuUseCaseInterface } from '@/application/useCases/menu/updateMenu/updateMenu.useCase.interface';

import { mainContainer } from '@/configuration/di/mainContainer';
import { TYPES } from '@/configuration/di/types';
import { HttpStatuses } from '@/entrypoints/api/config/httpStatuses';
import { jsonSuccessGetResponse, jsonErrorResponse, AppErrorCodes } from '@/entrypoints/api/helpers/hono.helper';
import { getHonoApp } from '@/entrypoints/api/loader/getHonoApp';
import { MenuSerializer } from '@/entrypoints/api/serializers/menu.serializer';

import { adminMenuUpdateSchema } from './schema';

const adminMenuUpdateRoute = getHonoApp();

const route = createRoute({
  method: 'put',
  path: '/menu/{id}',
  request: {
    params: adminMenuUpdateSchema.params,
    body: {
      content: {
        'application/json': {
          schema: adminMenuUpdateSchema.body,
        },
      },
    },
  },
  tags: ['admin', 'menu'],
  operationId: 'AdminMenuUpdate',
  summary: 'Menu - Update (admin)',
  responses: {
    200: jsonSuccessGetResponse(adminMenuUpdateSchema.response),
    400: jsonErrorResponse(AppErrorCodes.BAD_REQUEST),
    401: jsonErrorResponse(AppErrorCodes.UNAUTHORIZED),
    403: jsonErrorResponse(AppErrorCodes.FORBIDDEN),
    404: jsonErrorResponse(AppErrorCodes.NOT_FOUND_MENU),
  },
});

adminMenuUpdateRoute.openapi(route, async (c) => {
  const { id } = c.req.valid('param');
  const body = c.req.valid('json');

  const updateMenuUseCase = mainContainer.get<UpdateMenuUseCaseInterface>(TYPES.UpdateMenuUseCase);
  const menu = await updateMenuUseCase.executeUpdateMenu({ id, data: body });

  return c.json(MenuSerializer.serialize(menu), HttpStatuses.OK);
});

export { adminMenuUpdateRoute };
