import { createRoute } from '@hono/zod-openapi';

import { GetAllMenusUseCaseInterface } from '@/application/useCases/menu/getAllMenus/getAllMenus.useCase.interface';

import { mainContainer } from '@/configuration/di/mainContainer';
import { TYPES } from '@/configuration/di/types';
import { HttpStatuses } from '@/entrypoints/api/config/httpStatuses';
import { jsonSuccessGetResponse } from '@/entrypoints/api/helpers/hono.helper';
import { getHonoApp } from '@/entrypoints/api/loader/getHonoApp';
import { MenuSerializer } from '@/entrypoints/api/serializers/menu.serializer';

import { publicMenuGetAllSchema } from './schema';

const publicMenuGetAllRoute = getHonoApp();

const route = createRoute({
  method: 'get',
  path: '/menu',
  request: {
    query: publicMenuGetAllSchema.query,
  },
  tags: ['public', 'menu'],
  operationId: 'PublicMenuGetAll',
  summary: 'Menu - List available menus (public, filterable)',
  responses: {
    200: jsonSuccessGetResponse(publicMenuGetAllSchema.response),
  },
});

publicMenuGetAllRoute.openapi(route, async (c) => {
  const { theme, dietaryRegimeId, priceMax, priceMin, maxMinPersons, limit, offset, sortBy, sortOrder } =
    c.req.valid('query');

  const getAllMenusUseCase = mainContainer.get<GetAllMenusUseCaseInterface>(TYPES.GetAllMenusUseCase);

  const { items, totalCount } = await getAllMenusUseCase.executeGetAllMenus({
    theme,
    dietaryRegimeId,
    priceMax,
    priceMin,
    maxMinPersons,
    isAvailable: true,
    limit,
    offset,
    sortBy,
    sortOrder,
  });

  return c.json(
    {
      items: items.map((menu) => MenuSerializer.serializeForList(menu)),
      totalCount,
    },
    HttpStatuses.OK,
  );
});

export { publicMenuGetAllRoute };
