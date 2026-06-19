import { createRoute } from '@hono/zod-openapi';

import { GetAllAllergensUseCaseInterface } from '@/application/useCases/allergen/getAllAllergens/getAllAllergens.useCase.interface';

import { mainContainer } from '@/configuration/di/mainContainer';
import { TYPES } from '@/configuration/di/types';
import { HttpStatuses } from '@/entrypoints/api/config/httpStatuses';
import { jsonSuccessGetResponse, jsonErrorResponse, AppErrorCodes } from '@/entrypoints/api/helpers/hono.helper';
import { getHonoApp } from '@/entrypoints/api/loader/getHonoApp';
import { AllergenSerializer } from '@/entrypoints/api/serializers/allergen.serializer';

import { adminAllergenGetAllSchema } from './schema';

const adminAllergenGetAllRoute = getHonoApp();

const route = createRoute({
  method: 'get',
  path: '/allergen',
  request: {
    query: adminAllergenGetAllSchema.query,
  },
  tags: ['admin', 'allergen'],
  operationId: 'AdminAllergenGetAll',
  summary: 'Allergen - List allergens (admin)',
  responses: {
    200: jsonSuccessGetResponse(adminAllergenGetAllSchema.response),
    401: jsonErrorResponse(AppErrorCodes.UNAUTHORIZED),
    403: jsonErrorResponse(AppErrorCodes.FORBIDDEN),
  },
});

adminAllergenGetAllRoute.openapi(route, async (c) => {
  const { search, limit, offset, sortBy, sortOrder } = c.req.valid('query');

  const getAllAllergensUseCase = mainContainer.get<GetAllAllergensUseCaseInterface>(TYPES.GetAllAllergensUseCase);
  const { items, totalCount } = await getAllAllergensUseCase.executeGetAllAllergens({
    search,
    limit,
    offset,
    sortBy,
    sortOrder,
  });

  return c.json(
    {
      items: items.map((allergen) => AllergenSerializer.serializeForList(allergen)),
      totalCount,
    },
    HttpStatuses.OK,
  );
});

export { adminAllergenGetAllRoute };
