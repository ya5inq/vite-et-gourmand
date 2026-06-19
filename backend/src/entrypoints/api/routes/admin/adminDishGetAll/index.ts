import { createRoute } from '@hono/zod-openapi';

import { GetAllDishesUseCaseInterface } from '@/application/useCases/dish/getAllDishes/getAllDishes.useCase.interface';

import { mainContainer } from '@/configuration/di/mainContainer';
import { TYPES } from '@/configuration/di/types';
import { HttpStatuses } from '@/entrypoints/api/config/httpStatuses';
import { jsonSuccessGetResponse, jsonErrorResponse, AppErrorCodes } from '@/entrypoints/api/helpers/hono.helper';
import { getHonoApp } from '@/entrypoints/api/loader/getHonoApp';
import { DishSerializer } from '@/entrypoints/api/serializers/dish.serializer';

import { adminDishGetAllSchema } from './schema';

const adminDishGetAllRoute = getHonoApp();

const route = createRoute({
  method: 'get',
  path: '/dish',
  request: {
    query: adminDishGetAllSchema.query,
  },
  tags: ['admin', 'dish'],
  operationId: 'AdminDishGetAll',
  summary: 'Dish - List (admin)',
  responses: {
    200: jsonSuccessGetResponse(adminDishGetAllSchema.response),
    401: jsonErrorResponse(AppErrorCodes.UNAUTHORIZED),
    403: jsonErrorResponse(AppErrorCodes.FORBIDDEN),
  },
});

adminDishGetAllRoute.openapi(route, async (c) => {
  const { category, isAvailable, search, limit, offset, sortBy, sortOrder } = c.req.valid('query');

  const getAllDishesUseCase = mainContainer.get<GetAllDishesUseCaseInterface>(TYPES.GetAllDishesUseCase);
  const { items, totalCount } = await getAllDishesUseCase.executeGetAllDishes({
    category,
    isAvailable,
    search,
    limit,
    offset,
    sortBy,
    sortOrder,
  });

  return c.json(
    {
      items: items.map((dish) => DishSerializer.serializeForList(dish)),
      totalCount,
    },
    HttpStatuses.OK,
  );
});

export { adminDishGetAllRoute };
