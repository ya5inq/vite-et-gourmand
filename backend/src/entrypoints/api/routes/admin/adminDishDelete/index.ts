import { createRoute } from '@hono/zod-openapi';

import { DeleteDishUseCaseInterface } from '@/application/useCases/dish/deleteDish/deleteDish.useCase.interface';

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

import { adminDishDeleteSchema } from './schema';

const adminDishDeleteRoute = getHonoApp();

const route = createRoute({
  method: 'delete',
  path: '/dish/{id}',
  request: {
    params: adminDishDeleteSchema.params,
  },
  tags: ['admin', 'dish'],
  operationId: 'AdminDishDelete',
  summary: 'Dish - Delete (admin)',
  responses: {
    200: jsonSuccessResponse(AppSuccessCodes.ENTITY_DELETED),
    401: jsonErrorResponse(AppErrorCodes.UNAUTHORIZED),
    403: jsonErrorResponse(AppErrorCodes.FORBIDDEN),
    404: jsonErrorResponse(AppErrorCodes.NOT_FOUND_DISH),
  },
});

adminDishDeleteRoute.openapi(route, async (c) => {
  const { id } = c.req.valid('param');

  const deleteDishUseCase = mainContainer.get<DeleteDishUseCaseInterface>(TYPES.DeleteDishUseCase);
  await deleteDishUseCase.executeDeleteDish(id);

  return c.json(successResponse(c, AppSuccessCodes.ENTITY_DELETED), HttpStatuses.OK);
});

export { adminDishDeleteRoute };
