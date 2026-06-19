import { createRoute } from '@hono/zod-openapi';

import { DeleteMenuUseCaseInterface } from '@/application/useCases/menu/deleteMenu/deleteMenu.useCase.interface';

import { mainContainer } from '@/configuration/di/mainContainer';
import { TYPES } from '@/configuration/di/types';
import { HttpStatuses } from '@/entrypoints/api/config/httpStatuses';
import {
  jsonSuccessResponse,
  jsonErrorResponse,
  AppErrorCodes,
  AppSuccessCodes,
} from '@/entrypoints/api/helpers/hono.helper';
import { successResponse } from '@/entrypoints/api/helpers/response.helper';
import { getHonoApp } from '@/entrypoints/api/loader/getHonoApp';

import { adminMenuDeleteSchema } from './schema';

const adminMenuDeleteRoute = getHonoApp();

const route = createRoute({
  method: 'delete',
  path: '/menu/{id}',
  request: {
    params: adminMenuDeleteSchema.params,
  },
  tags: ['admin', 'menu'],
  operationId: 'AdminMenuDelete',
  summary: 'Menu - Delete (admin)',
  responses: {
    200: jsonSuccessResponse(AppSuccessCodes.ENTITY_DELETED),
    401: jsonErrorResponse(AppErrorCodes.UNAUTHORIZED),
    403: jsonErrorResponse(AppErrorCodes.FORBIDDEN),
    404: jsonErrorResponse(AppErrorCodes.NOT_FOUND_MENU),
  },
});

adminMenuDeleteRoute.openapi(route, async (c) => {
  const { id } = c.req.valid('param');

  const deleteMenuUseCase = mainContainer.get<DeleteMenuUseCaseInterface>(TYPES.DeleteMenuUseCase);
  await deleteMenuUseCase.executeDeleteMenu(id);

  return c.json(successResponse(c, AppSuccessCodes.ENTITY_DELETED), HttpStatuses.OK);
});

export { adminMenuDeleteRoute };
