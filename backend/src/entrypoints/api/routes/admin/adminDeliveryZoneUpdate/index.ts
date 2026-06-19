import { createRoute } from '@hono/zod-openapi';

import { UpdateDeliveryZoneUseCaseInterface } from '@/application/useCases/deliveryZone/updateDeliveryZone/updateDeliveryZone.useCase.interface';

import { mainContainer } from '@/configuration/di/mainContainer';
import { TYPES } from '@/configuration/di/types';
import { HttpStatuses } from '@/entrypoints/api/config/httpStatuses';
import { jsonSuccessGetResponse, jsonErrorResponse, AppErrorCodes } from '@/entrypoints/api/helpers/hono.helper';
import { getHonoApp } from '@/entrypoints/api/loader/getHonoApp';
import { DeliveryZoneSerializer } from '@/entrypoints/api/serializers/deliveryZone.serializer';

import { adminDeliveryZoneUpdateSchema } from './schema';

const adminDeliveryZoneUpdateRoute = getHonoApp();

const route = createRoute({
  method: 'put',
  path: '/delivery-zone/{id}',
  request: {
    params: adminDeliveryZoneUpdateSchema.params,
    body: {
      content: {
        'application/json': {
          schema: adminDeliveryZoneUpdateSchema.body,
        },
      },
    },
  },
  tags: ['admin', 'delivery-zone'],
  operationId: 'AdminDeliveryZoneUpdate',
  summary: 'Delivery zone - Update (admin)',
  responses: {
    200: jsonSuccessGetResponse(adminDeliveryZoneUpdateSchema.response),
    400: jsonErrorResponse(AppErrorCodes.BAD_REQUEST),
    401: jsonErrorResponse(AppErrorCodes.UNAUTHORIZED),
    403: jsonErrorResponse(AppErrorCodes.FORBIDDEN),
    404: jsonErrorResponse(AppErrorCodes.NOT_FOUND_DELIVERY_ZONE),
  },
});

adminDeliveryZoneUpdateRoute.openapi(route, async (c) => {
  const { id } = c.req.valid('param');
  const body = c.req.valid('json');

  const updateDeliveryZoneUseCase = mainContainer.get<UpdateDeliveryZoneUseCaseInterface>(
    TYPES.UpdateDeliveryZoneUseCase,
  );
  const deliveryZone = await updateDeliveryZoneUseCase.executeUpdateDeliveryZone({ id, data: body });

  return c.json(DeliveryZoneSerializer.serialize(deliveryZone), HttpStatuses.OK);
});

export { adminDeliveryZoneUpdateRoute };
