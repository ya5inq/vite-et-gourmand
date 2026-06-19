import { createRoute } from '@hono/zod-openapi';

import { GetAllDeliveryZonesUseCaseInterface } from '@/application/useCases/deliveryZone/getAllDeliveryZones/getAllDeliveryZones.useCase.interface';

import { mainContainer } from '@/configuration/di/mainContainer';
import { TYPES } from '@/configuration/di/types';
import { HttpStatuses } from '@/entrypoints/api/config/httpStatuses';
import { jsonSuccessGetResponse, jsonErrorResponse, AppErrorCodes } from '@/entrypoints/api/helpers/hono.helper';
import { getHonoApp } from '@/entrypoints/api/loader/getHonoApp';
import { DeliveryZoneSerializer } from '@/entrypoints/api/serializers/deliveryZone.serializer';

import { adminDeliveryZoneGetAllSchema } from './schema';

const adminDeliveryZoneGetAllRoute = getHonoApp();

const route = createRoute({
  method: 'get',
  path: '/delivery-zone',
  request: {
    query: adminDeliveryZoneGetAllSchema.query,
  },
  tags: ['admin', 'delivery-zone'],
  operationId: 'AdminDeliveryZoneGetAll',
  summary: 'Delivery zone - List zones (admin)',
  responses: {
    200: jsonSuccessGetResponse(adminDeliveryZoneGetAllSchema.response),
    401: jsonErrorResponse(AppErrorCodes.UNAUTHORIZED),
    403: jsonErrorResponse(AppErrorCodes.FORBIDDEN),
  },
});

adminDeliveryZoneGetAllRoute.openapi(route, async (c) => {
  const { search, isActive, limit, offset, sortBy, sortOrder } = c.req.valid('query');

  const getAllDeliveryZonesUseCase = mainContainer.get<GetAllDeliveryZonesUseCaseInterface>(
    TYPES.GetAllDeliveryZonesUseCase,
  );
  const { items, totalCount } = await getAllDeliveryZonesUseCase.executeGetAllDeliveryZones({
    search,
    isActive: isActive === undefined ? undefined : isActive === 'true',
    limit,
    offset,
    sortBy,
    sortOrder,
  });

  return c.json(
    {
      items: items.map((zone) => DeliveryZoneSerializer.serializeForList(zone)),
      totalCount,
    },
    HttpStatuses.OK,
  );
});

export { adminDeliveryZoneGetAllRoute };
