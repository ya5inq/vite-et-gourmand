import { createRoute } from '@hono/zod-openapi';

import { DeleteDeliveryZoneUseCaseInterface } from '@/application/useCases/deliveryZone/deleteDeliveryZone/deleteDeliveryZone.useCase.interface';

import { mainContainer } from '@/configuration/di/mainContainer';
import { TYPES } from '@/configuration/di/types';
import { HttpStatuses } from '@/entrypoints/api/config/httpStatuses';
import {
  jsonSuccessResponse,
  jsonErrorResponse,
  AppErrorCodes,
  AppSuccessCodes,
} from '@/entrypoints/api/helpers/hono.helper';
import { successResponse } from '@/entrypoints/api/helpers/response.helper';
import { getHonoApp } from '@/entrypoints/api/loader/getHonoApp';

import { adminDeliveryZoneDeleteSchema } from './schema';

const adminDeliveryZoneDeleteRoute = getHonoApp();

const route = createRoute({
  method: 'delete',
  path: '/delivery-zone/{id}',
  request: {
    params: adminDeliveryZoneDeleteSchema.params,
  },
  tags: ['admin', 'delivery-zone'],
  operationId: 'AdminDeliveryZoneDelete',
  summary: 'Delivery zone - Delete (admin)',
  responses: {
    200: jsonSuccessResponse(AppSuccessCodes.ENTITY_DELETED),
    401: jsonErrorResponse(AppErrorCodes.UNAUTHORIZED),
    403: jsonErrorResponse(AppErrorCodes.FORBIDDEN),
    404: jsonErrorResponse(AppErrorCodes.NOT_FOUND_DELIVERY_ZONE),
  },
});

adminDeliveryZoneDeleteRoute.openapi(route, async (c) => {
  const { id } = c.req.valid('param');

  const deleteDeliveryZoneUseCase = mainContainer.get<DeleteDeliveryZoneUseCaseInterface>(
    TYPES.DeleteDeliveryZoneUseCase,
  );
  await deleteDeliveryZoneUseCase.executeDeleteDeliveryZone(id);

  return c.json(successResponse(c, AppSuccessCodes.ENTITY_DELETED), HttpStatuses.OK);
});

export { adminDeliveryZoneDeleteRoute };
