import { createRoute } from '@hono/zod-openapi';

import { CalculateDeliveryPriceUseCaseInterface } from '@/application/useCases/deliveryZone/calculateDeliveryPrice/calculateDeliveryPrice.useCase.interface';

import { mainContainer } from '@/configuration/di/mainContainer';
import { TYPES } from '@/configuration/di/types';
import { HttpStatuses } from '@/entrypoints/api/config/httpStatuses';
import { jsonSuccessGetResponse, jsonErrorResponse, AppErrorCodes } from '@/entrypoints/api/helpers/hono.helper';
import { getHonoApp } from '@/entrypoints/api/loader/getHonoApp';

import { publicDeliveryZoneCalculatePriceSchema } from './schema';

const publicDeliveryZoneCalculatePriceRoute = getHonoApp();

const route = createRoute({
  method: 'post',
  path: '/delivery-zone/calculate-price',
  request: {
    body: {
      content: {
        'application/json': {
          schema: publicDeliveryZoneCalculatePriceSchema.body,
        },
      },
    },
  },
  tags: ['public', 'delivery-zone'],
  operationId: 'PublicDeliveryZoneCalculatePrice',
  summary: 'Delivery zone - Calculate delivery fee for a zone or postal code (public)',
  responses: {
    200: jsonSuccessGetResponse(publicDeliveryZoneCalculatePriceSchema.response),
    400: jsonErrorResponse(AppErrorCodes.BAD_REQUEST),
    404: jsonErrorResponse(AppErrorCodes.NOT_FOUND_DELIVERY_ZONE),
  },
});

publicDeliveryZoneCalculatePriceRoute.openapi(route, async (c) => {
  const body = c.req.valid('json');

  const calculateDeliveryPriceUseCase = mainContainer.get<CalculateDeliveryPriceUseCaseInterface>(
    TYPES.CalculateDeliveryPriceUseCase,
  );
  const result = await calculateDeliveryPriceUseCase.executeCalculateDeliveryPrice({
    deliveryZoneId: body.deliveryZoneId,
    postalCode: body.postalCode,
  });

  return c.json(result, HttpStatuses.OK);
});

export { publicDeliveryZoneCalculatePriceRoute };
