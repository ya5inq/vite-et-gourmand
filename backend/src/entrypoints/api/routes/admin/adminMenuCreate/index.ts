import { createRoute } from '@hono/zod-openapi';

import { CreateMenuUseCaseInterface } from '@/application/useCases/menu/createMenu/createMenu.useCase.interface';

import { mainContainer } from '@/configuration/di/mainContainer';
import { TYPES } from '@/configuration/di/types';
import { HttpStatuses } from '@/entrypoints/api/config/httpStatuses';
import { jsonSuccessGetResponse, jsonErrorResponse, AppErrorCodes } from '@/entrypoints/api/helpers/hono.helper';
import { getHonoApp } from '@/entrypoints/api/loader/getHonoApp';
import { MenuSerializer } from '@/entrypoints/api/serializers/menu.serializer';

import { adminMenuCreateSchema } from './schema';

const adminMenuCreateRoute = getHonoApp();

const route = createRoute({
  method: 'post',
  path: '/menu',
  request: {
    body: {
      content: {
        'application/json': {
          schema: adminMenuCreateSchema.body,
        },
      },
    },
  },
  tags: ['admin', 'menu'],
  operationId: 'AdminMenuCreate',
  summary: 'Menu - Create (admin)',
  responses: {
    201: jsonSuccessGetResponse(adminMenuCreateSchema.response),
    400: jsonErrorResponse(AppErrorCodes.BAD_REQUEST),
    401: jsonErrorResponse(AppErrorCodes.UNAUTHORIZED),
    403: jsonErrorResponse(AppErrorCodes.FORBIDDEN),
  },
});

adminMenuCreateRoute.openapi(route, async (c) => {
  const body = c.req.valid('json');

  const createMenuUseCase = mainContainer.get<CreateMenuUseCaseInterface>(TYPES.CreateMenuUseCase);
  const menu = await createMenuUseCase.executeCreateMenu({
    name: body.name,
    description: body.description ?? null,
    theme: body.theme ?? null,
    price: body.price,
    minPersons: body.minPersons,
    maxPersons: body.maxPersons ?? null,
    stock: body.stock ?? null,
    conditions: body.conditions ?? null,
    imageUrl: body.imageUrl ?? null,
    isAvailable: body.isAvailable,
    dishIds: body.dishIds,
    dietaryRegimeIds: body.dietaryRegimeIds,
  });

  return c.json(MenuSerializer.serialize(menu), HttpStatuses.CREATED);
});

export { adminMenuCreateRoute };
