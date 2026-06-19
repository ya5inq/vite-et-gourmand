import { createRoute } from '@hono/zod-openapi';

import { GetAllDietaryRegimesUseCaseInterface } from '@/application/useCases/dietaryRegime/getAllDietaryRegimes/getAllDietaryRegimes.useCase.interface';

import { mainContainer } from '@/configuration/di/mainContainer';
import { TYPES } from '@/configuration/di/types';
import { HttpStatuses } from '@/entrypoints/api/config/httpStatuses';
import { jsonSuccessGetResponse, jsonErrorResponse, AppErrorCodes } from '@/entrypoints/api/helpers/hono.helper';
import { getHonoApp } from '@/entrypoints/api/loader/getHonoApp';
import { DietaryRegimeSerializer } from '@/entrypoints/api/serializers/dietaryRegime.serializer';

import { adminDietaryRegimeGetAllSchema } from './schema';

const adminDietaryRegimeGetAllRoute = getHonoApp();

const route = createRoute({
  method: 'get',
  path: '/dietary-regime',
  request: {
    query: adminDietaryRegimeGetAllSchema.query,
  },
  tags: ['admin', 'dietary-regime'],
  operationId: 'AdminDietaryRegimeGetAll',
  summary: 'Dietary Regime - List (admin)',
  responses: {
    200: jsonSuccessGetResponse(adminDietaryRegimeGetAllSchema.response),
    401: jsonErrorResponse(AppErrorCodes.UNAUTHORIZED),
    403: jsonErrorResponse(AppErrorCodes.FORBIDDEN),
  },
});

adminDietaryRegimeGetAllRoute.openapi(route, async (c) => {
  const { search, limit, offset, sortBy, sortOrder } = c.req.valid('query');

  const getAllDietaryRegimesUseCase = mainContainer.get<GetAllDietaryRegimesUseCaseInterface>(
    TYPES.GetAllDietaryRegimesUseCase,
  );
  const { items, totalCount } = await getAllDietaryRegimesUseCase.executeGetAllDietaryRegimes({
    search,
    limit,
    offset,
    sortBy,
    sortOrder,
  });

  return c.json(
    {
      items: items.map((regime) => DietaryRegimeSerializer.serializeForList(regime)),
      totalCount,
    },
    HttpStatuses.OK,
  );
});

export { adminDietaryRegimeGetAllRoute };
