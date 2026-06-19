import { createRoute } from '@hono/zod-openapi';

import { GetDishUseCaseInterface } from '@/application/useCases/dish/getDish/getDish.useCase.interface';

import { mainContainer } from '@/configuration/di/mainContainer';
import { TYPES } from '@/configuration/di/types';
import { HttpStatuses } from '@/entrypoints/api/config/httpStatuses';
import { jsonSuccessGetResponse, jsonErrorResponse, AppErrorCodes } from '@/entrypoints/api/helpers/hono.helper';
import { getHonoApp } from '@/entrypoints/api/loader/getHonoApp';
import { DishSerializer } from '@/entrypoints/api/serializers/dish.serializer';

import { adminDishGetOneSchema } from './schema';

const adminDishGetOneRoute = getHonoApp();

const route = createRoute({
  method: 'get',
  path: '/dish/{id}',
  request: {
    params: adminDishGetOneSchema.params,
  },
  tags: ['admin', 'dish'],
  operationId: 'AdminDishGetOne',
  summary: 'Dish - Get one (admin)',
  responses: {
    200: jsonSuccessGetResponse(adminDishGetOneSchema.response),
    401: jsonErrorResponse(AppErrorCodes.UNAUTHORIZED),
    403: jsonErrorResponse(AppErrorCodes.FORBIDDEN),
    404: jsonErrorResponse(AppErrorCodes.NOT_FOUND_DISH),
  },
});

adminDishGetOneRoute.openapi(route, async (c) => {
  const { id } = c.req.valid('param');

  const getDishUseCase = mainContainer.get<GetDishUseCaseInterface>(TYPES.GetDishUseCase);
  const dish = await getDishUseCase.executeGetDish(id);

  return c.json(DishSerializer.serialize(dish), HttpStatuses.OK);
});

export { adminDishGetOneRoute };
