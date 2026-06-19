import { createRoute } from '@hono/zod-openapi';

import { UpdateOrderStatusUseCaseInterface } from '@/application/useCases/order/updateOrderStatus/updateOrderStatus.useCase.interface';

import { mainContainer } from '@/configuration/di/mainContainer';
import { TYPES } from '@/configuration/di/types';
import { OrderContactModeEnum } from '@/domain/entities/order/orderContactMode';
import { OrderStatusEnum } from '@/domain/entities/order/orderStatus';
import { HttpStatuses } from '@/entrypoints/api/config/httpStatuses';
import { jsonSuccessGetResponse, jsonErrorResponse, AppErrorCodes } from '@/entrypoints/api/helpers/hono.helper';
import { getHonoApp } from '@/entrypoints/api/loader/getHonoApp';
import { OrderSerializer } from '@/entrypoints/api/serializers/order.serializer';

import { adminOrderUpdateStatusSchema } from './schema';

const adminOrderUpdateStatusRoute = getHonoApp();

const route = createRoute({
  method: 'patch',
  path: '/order/{id}/status',
  request: {
    params: adminOrderUpdateStatusSchema.params,
    body: {
      content: {
        'application/json': {
          schema: adminOrderUpdateStatusSchema.body,
        },
      },
    },
  },
  tags: ['admin', 'order'],
  operationId: 'AdminOrderUpdateStatus',
  summary: 'Order - Update status (admin)',
  responses: {
    200: jsonSuccessGetResponse(adminOrderUpdateStatusSchema.response),
    400: jsonErrorResponse(AppErrorCodes.BAD_REQUEST_INVALID_ORDER_TRANSITION),
    401: jsonErrorResponse(AppErrorCodes.UNAUTHORIZED),
    403: jsonErrorResponse(AppErrorCodes.FORBIDDEN),
    404: jsonErrorResponse(AppErrorCodes.NOT_FOUND_ORDER),
  },
});

adminOrderUpdateStatusRoute.openapi(route, async (c) => {
  const currentUser = c.get('currentUser');
  const { id } = c.req.valid('param');
  const { newStatus, reason, contactMode } = c.req.valid('json');

  const updateOrderStatusUseCase = mainContainer.get<UpdateOrderStatusUseCaseInterface>(TYPES.UpdateOrderStatusUseCase);
  const order = await updateOrderStatusUseCase.executeUpdateOrderStatus({
    orderId: id,
    newStatus: newStatus as OrderStatusEnum,
    actorId: currentUser?.id as string,
    actorRole: currentUser!.role,
    reason: reason ?? null,
    contactMode: (contactMode as OrderContactModeEnum | undefined) ?? null,
  });

  return c.json(OrderSerializer.serializeDetail(order), HttpStatuses.OK);
});

export { adminOrderUpdateStatusRoute };
