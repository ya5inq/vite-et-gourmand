import { createRoute } from '@hono/zod-openapi';

import { GetAllDietaryRegimesUseCaseInterface } from '@/application/useCases/dietaryRegime/getAllDietaryRegimes/getAllDietaryRegimes.useCase.interface';

import { mainContainer } from '@/configuration/di/mainContainer';
import { TYPES } from '@/configuration/di/types';
import { HttpStatuses } from '@/entrypoints/api/config/httpStatuses';
import { jsonSuccessGetResponse } from '@/entrypoints/api/helpers/hono.helper';
import { getHonoApp } from '@/entrypoints/api/loader/getHonoApp';
import { DietaryRegimeSerializer } from '@/entrypoints/api/serializers/dietaryRegime.serializer';

import { publicDietaryRegimeGetAllSchema } from './schema';

const publicDietaryRegimeGetAllRoute = getHonoApp();

const route = createRoute({
  method: 'get',
  path: '/dietary-regime',
  tags: ['public', 'dietary-regime'],
  operationId: 'PublicDietaryRegimeGetAll',
  summary: 'Dietary Regime - List dietary regimes (public, used for filters)',
  responses: {
    200: jsonSuccessGetResponse(publicDietaryRegimeGetAllSchema.response),
  },
});

publicDietaryRegimeGetAllRoute.openapi(route, async (c) => {
  const getAllDietaryRegimesUseCase = mainContainer.get<GetAllDietaryRegimesUseCaseInterface>(
    TYPES.GetAllDietaryRegimesUseCase,
  );
  const { items, totalCount } = await getAllDietaryRegimesUseCase.executeGetAllDietaryRegimes();

  return c.json(
    {
      items: items.map((regime) => DietaryRegimeSerializer.serializeForList(regime)),
      totalCount,
    },
    HttpStatuses.OK,
  );
});

export { publicDietaryRegimeGetAllRoute };
