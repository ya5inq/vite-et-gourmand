import { createRoute } from '@hono/zod-openapi';

import { UpdateDishUseCaseInterface } from '@/application/useCases/dish/updateDish/updateDish.useCase.interface';

import { mainContainer } from '@/configuration/di/mainContainer';
import { TYPES } from '@/configuration/di/types';
import { HttpStatuses } from '@/entrypoints/api/config/httpStatuses';
import { jsonSuccessGetResponse, jsonErrorResponse, AppErrorCodes } from '@/entrypoints/api/helpers/hono.helper';
import { getHonoApp } from '@/entrypoints/api/loader/getHonoApp';
import { DishSerializer } from '@/entrypoints/api/serializers/dish.serializer';

import { adminDishUpdateSchema } from './schema';

const adminDishUpdateRoute = getHonoApp();

const route = createRoute({
  method: 'put',
  path: '/dish/{id}',
  request: {
    params: adminDishUpdateSchema.params,
    body: {
      content: {
        'application/json': {
          schema: adminDishUpdateSchema.body,
        },
      },
    },
  },
  tags: ['admin', 'dish'],
  operationId: 'AdminDishUpdate',
  summary: 'Dish - Update (admin)',
  responses: {
    200: jsonSuccessGetResponse(adminDishUpdateSchema.response),
    400: jsonErrorResponse(AppErrorCodes.BAD_REQUEST),
    401: jsonErrorResponse(AppErrorCodes.UNAUTHORIZED),
    403: jsonErrorResponse(AppErrorCodes.FORBIDDEN),
    404: jsonErrorResponse(AppErrorCodes.NOT_FOUND_DISH),
  },
});

adminDishUpdateRoute.openapi(route, async (c) => {
  const { id } = c.req.valid('param');
  const body = c.req.valid('json');

  const updateDishUseCase = mainContainer.get<UpdateDishUseCaseInterface>(TYPES.UpdateDishUseCase);
  const dish = await updateDishUseCase.executeUpdateDish({ id, data: body });

  return c.json(DishSerializer.serialize(dish), HttpStatuses.OK);
});

export { adminDishUpdateRoute };
