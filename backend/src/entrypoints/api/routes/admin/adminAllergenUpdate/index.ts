import { createRoute } from '@hono/zod-openapi';

import { UpdateAllergenUseCaseInterface } from '@/application/useCases/allergen/updateAllergen/updateAllergen.useCase.interface';

import { mainContainer } from '@/configuration/di/mainContainer';
import { TYPES } from '@/configuration/di/types';
import { HttpStatuses } from '@/entrypoints/api/config/httpStatuses';
import { jsonSuccessGetResponse, jsonErrorResponse, AppErrorCodes } from '@/entrypoints/api/helpers/hono.helper';
import { getHonoApp } from '@/entrypoints/api/loader/getHonoApp';
import { AllergenSerializer } from '@/entrypoints/api/serializers/allergen.serializer';

import { adminAllergenUpdateSchema } from './schema';

const adminAllergenUpdateRoute = getHonoApp();

const route = createRoute({
  method: 'put',
  path: '/allergen/{id}',
  request: {
    params: adminAllergenUpdateSchema.params,
    body: {
      content: {
        'application/json': {
          schema: adminAllergenUpdateSchema.body,
        },
      },
    },
  },
  tags: ['admin', 'allergen'],
  operationId: 'AdminAllergenUpdate',
  summary: 'Allergen - Update (admin)',
  responses: {
    200: jsonSuccessGetResponse(adminAllergenUpdateSchema.response),
    400: jsonErrorResponse(AppErrorCodes.BAD_REQUEST),
    401: jsonErrorResponse(AppErrorCodes.UNAUTHORIZED),
    403: jsonErrorResponse(AppErrorCodes.FORBIDDEN),
    404: jsonErrorResponse(AppErrorCodes.NOT_FOUND_ALLERGEN),
  },
});

adminAllergenUpdateRoute.openapi(route, async (c) => {
  const { id } = c.req.valid('param');
  const body = c.req.valid('json');

  const updateAllergenUseCase = mainContainer.get<UpdateAllergenUseCaseInterface>(TYPES.UpdateAllergenUseCase);
  const allergen = await updateAllergenUseCase.executeUpdateAllergen({ id, data: body });

  return c.json(AllergenSerializer.serialize(allergen), HttpStatuses.OK);
});

export { adminAllergenUpdateRoute };
