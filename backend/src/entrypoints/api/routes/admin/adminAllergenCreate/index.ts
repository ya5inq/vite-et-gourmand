import { createRoute } from '@hono/zod-openapi';

import { CreateAllergenUseCaseInterface } from '@/application/useCases/allergen/createAllergen/createAllergen.useCase.interface';

import { mainContainer } from '@/configuration/di/mainContainer';
import { TYPES } from '@/configuration/di/types';
import { HttpStatuses } from '@/entrypoints/api/config/httpStatuses';
import { jsonSuccessGetResponse, jsonErrorResponse, AppErrorCodes } from '@/entrypoints/api/helpers/hono.helper';
import { getHonoApp } from '@/entrypoints/api/loader/getHonoApp';
import { AllergenSerializer } from '@/entrypoints/api/serializers/allergen.serializer';

import { adminAllergenCreateSchema } from './schema';

const adminAllergenCreateRoute = getHonoApp();

const route = createRoute({
  method: 'post',
  path: '/allergen',
  request: {
    body: {
      content: {
        'application/json': {
          schema: adminAllergenCreateSchema.body,
        },
      },
    },
  },
  tags: ['admin', 'allergen'],
  operationId: 'AdminAllergenCreate',
  summary: 'Allergen - Create (admin)',
  responses: {
    201: jsonSuccessGetResponse(adminAllergenCreateSchema.response),
    400: jsonErrorResponse(AppErrorCodes.BAD_REQUEST),
    401: jsonErrorResponse(AppErrorCodes.UNAUTHORIZED),
    403: jsonErrorResponse(AppErrorCodes.FORBIDDEN),
  },
});

adminAllergenCreateRoute.openapi(route, async (c) => {
  const body = c.req.valid('json');

  const createAllergenUseCase = mainContainer.get<CreateAllergenUseCaseInterface>(TYPES.CreateAllergenUseCase);
  const allergen = await createAllergenUseCase.executeCreateAllergen({
    name: body.name,
    icon: body.icon ?? null,
  });

  return c.json(AllergenSerializer.serialize(allergen), HttpStatuses.CREATED);
});

export { adminAllergenCreateRoute };
