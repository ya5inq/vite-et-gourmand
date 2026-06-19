import { createRoute } from '@hono/zod-openapi';

import { CreateDishUseCaseInterface } from '@/application/useCases/dish/createDish/createDish.useCase.interface';

import { mainContainer } from '@/configuration/di/mainContainer';
import { TYPES } from '@/configuration/di/types';
import { HttpStatuses } from '@/entrypoints/api/config/httpStatuses';
import { jsonSuccessGetResponse, jsonErrorResponse, AppErrorCodes } from '@/entrypoints/api/helpers/hono.helper';
import { getHonoApp } from '@/entrypoints/api/loader/getHonoApp';
import { DishSerializer } from '@/entrypoints/api/serializers/dish.serializer';

import { adminDishCreateSchema } from './schema';

const adminDishCreateRoute = getHonoApp();

const route = createRoute({
  method: 'post',
  path: '/dish',
  request: {
    body: {
      content: {
        'application/json': {
          schema: adminDishCreateSchema.body,
        },
      },
    },
  },
  tags: ['admin', 'dish'],
  operationId: 'AdminDishCreate',
  summary: 'Dish - Create (admin)',
  responses: {
    201: jsonSuccessGetResponse(adminDishCreateSchema.response),
    400: jsonErrorResponse(AppErrorCodes.BAD_REQUEST),
    401: jsonErrorResponse(AppErrorCodes.UNAUTHORIZED),
    403: jsonErrorResponse(AppErrorCodes.FORBIDDEN),
  },
});

adminDishCreateRoute.openapi(route, async (c) => {
  const body = c.req.valid('json');

  const createDishUseCase = mainContainer.get<CreateDishUseCaseInterface>(TYPES.CreateDishUseCase);
  const dish = await createDishUseCase.executeCreateDish({
    name: body.name,
    description: body.description ?? null,
    category: body.category,
    price: body.price ?? null,
    imageUrl: body.imageUrl ?? null,
    isAvailable: body.isAvailable,
    allergenIds: body.allergenIds,
  });

  return c.json(DishSerializer.serialize(dish), HttpStatuses.CREATED);
});

export { adminDishCreateRoute };
