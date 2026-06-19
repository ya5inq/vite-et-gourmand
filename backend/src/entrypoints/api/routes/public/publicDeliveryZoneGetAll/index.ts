import { createRoute } from '@hono/zod-openapi';

import { GetAllDeliveryZonesUseCaseInterface } from '@/application/useCases/deliveryZone/getAllDeliveryZones/getAllDeliveryZones.useCase.interface';

import { mainContainer } from '@/configuration/di/mainContainer';
import { TYPES } from '@/configuration/di/types';
import { HttpStatuses } from '@/entrypoints/api/config/httpStatuses';
import { jsonSuccessGetResponse } from '@/entrypoints/api/helpers/hono.helper';
import { getHonoApp } from '@/entrypoints/api/loader/getHonoApp';
import { DeliveryZoneSerializer } from '@/entrypoints/api/serializers/deliveryZone.serializer';

import { publicDeliveryZoneGetAllSchema } from './schema';

const publicDeliveryZoneGetAllRoute = getHonoApp();

const route = createRoute({
  method: 'get',
  path: '/delivery-zone',
  tags: ['public', 'delivery-zone'],
  operationId: 'PublicDeliveryZoneGetAll',
  summary: 'Delivery zone - List active zones (public)',
  responses: {
    200: jsonSuccessGetResponse(publicDeliveryZoneGetAllSchema.response),
  },
});

publicDeliveryZoneGetAllRoute.openapi(route, async (c) => {
  const getAllDeliveryZonesUseCase = mainContainer.get<GetAllDeliveryZonesUseCaseInterface>(
    TYPES.GetAllDeliveryZonesUseCase,
  );
  const { items, totalCount } = await getAllDeliveryZonesUseCase.executeGetAllDeliveryZones({ isActive: true });

  return c.json(
    {
      items: items.map((zone) => DeliveryZoneSerializer.serializeForList(zone)),
      totalCount,
    },
    HttpStatuses.OK,
  );
});

export { publicDeliveryZoneGetAllRoute };
