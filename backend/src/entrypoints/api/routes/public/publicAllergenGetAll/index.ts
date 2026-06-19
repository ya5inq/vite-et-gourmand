import { createRoute } from '@hono/zod-openapi';

import { GetAllAllergensUseCaseInterface } from '@/application/useCases/allergen/getAllAllergens/getAllAllergens.useCase.interface';

import { mainContainer } from '@/configuration/di/mainContainer';
import { TYPES } from '@/configuration/di/types';
import { HttpStatuses } from '@/entrypoints/api/config/httpStatuses';
import { jsonSuccessGetResponse } from '@/entrypoints/api/helpers/hono.helper';
import { getHonoApp } from '@/entrypoints/api/loader/getHonoApp';
import { AllergenSerializer } from '@/entrypoints/api/serializers/allergen.serializer';

import { publicAllergenGetAllSchema } from './schema';

const publicAllergenGetAllRoute = getHonoApp();

const route = createRoute({
  method: 'get',
  path: '/allergen',
  tags: ['public', 'allergen'],
  operationId: 'PublicAllergenGetAll',
  summary: 'Allergen - List allergens (public, used for filters)',
  responses: {
    200: jsonSuccessGetResponse(publicAllergenGetAllSchema.response),
  },
});

publicAllergenGetAllRoute.openapi(route, async (c) => {
  const getAllAllergensUseCase = mainContainer.get<GetAllAllergensUseCaseInterface>(TYPES.GetAllAllergensUseCase);
  const { items, totalCount } = await getAllAllergensUseCase.executeGetAllAllergens();

  return c.json(
    {
      items: items.map((allergen) => AllergenSerializer.serializeForList(allergen)),
      totalCount,
    },
    HttpStatuses.OK,
  );
});

export { publicAllergenGetAllRoute };
