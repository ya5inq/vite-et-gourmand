import { createRoute } from '@hono/zod-openapi';

import { CreateDeliveryZoneUseCaseInterface } from '@/application/useCases/deliveryZone/createDeliveryZone/createDeliveryZone.useCase.interface';

import { mainContainer } from '@/configuration/di/mainContainer';
import { TYPES } from '@/configuration/di/types';
import { HttpStatuses } from '@/entrypoints/api/config/httpStatuses';
import { jsonSuccessGetResponse, jsonErrorResponse, AppErrorCodes } from '@/entrypoints/api/helpers/hono.helper';
import { getHonoApp } from '@/entrypoints/api/loader/getHonoApp';
import { DeliveryZoneSerializer } from '@/entrypoints/api/serializers/deliveryZone.serializer';

import { adminDeliveryZoneCreateSchema } from './schema';

const adminDeliveryZoneCreateRoute = getHonoApp();

const route = createRoute({
  method: 'post',
  path: '/delivery-zone',
  request: {
    body: {
      content: {
        'application/json': {
          schema: adminDeliveryZoneCreateSchema.body,
        },
      },
    },
  },
  tags: ['admin', 'delivery-zone'],
  operationId: 'AdminDeliveryZoneCreate',
  summary: 'Delivery zone - Create (admin)',
  responses: {
    201: jsonSuccessGetResponse(adminDeliveryZoneCreateSchema.response),
    400: jsonErrorResponse(AppErrorCodes.BAD_REQUEST),
    401: jsonErrorResponse(AppErrorCodes.UNAUTHORIZED),
    403: jsonErrorResponse(AppErrorCodes.FORBIDDEN),
  },
});

adminDeliveryZoneCreateRoute.openapi(route, async (c) => {
  const body = c.req.valid('json');

  const createDeliveryZoneUseCase = mainContainer.get<CreateDeliveryZoneUseCaseInterface>(
    TYPES.CreateDeliveryZoneUseCase,
  );
  const deliveryZone = await createDeliveryZoneUseCase.executeCreateDeliveryZone({
    name: body.name,
    postalCode: body.postalCode ?? null,
    city: body.city ?? null,
    distanceKm: body.distanceKm,
    isActive: body.isActive,
  });

  return c.json(DeliveryZoneSerializer.serialize(deliveryZone), HttpStatuses.CREATED);
});

export { adminDeliveryZoneCreateRoute };
