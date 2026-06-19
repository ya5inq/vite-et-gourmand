import { createRoute } from '@hono/zod-openapi';

import { GetUserOrdersUseCaseInterface } from '@/application/useCases/order/getUserOrders/getUserOrders.useCase.interface';
import { OrderSortBy } from '@/domain/interfaces/repositories/order.repository.interface';

import { mainContainer } from '@/configuration/di/mainContainer';
import { TYPES } from '@/configuration/di/types';
import { OrderStatusEnum } from '@/domain/entities/order/orderStatus';
import { HttpStatuses } from '@/entrypoints/api/config/httpStatuses';
import { jsonSuccessGetResponse, jsonErrorResponse, AppErrorCodes } from '@/entrypoints/api/helpers/hono.helper';
import { getHonoApp } from '@/entrypoints/api/loader/getHonoApp';
import { OrderSerializer } from '@/entrypoints/api/serializers/order.serializer';

import { protectedOrderGetAllSchema } from './schema';

const protectedOrderGetAllRoute = getHonoApp();

const route = createRoute({
  method: 'get',
  path: '/order',
  request: {
    query: protectedOrderGetAllSchema.query,
  },
  tags: ['protected', 'order'],
  operationId: 'ProtectedOrderGetAll',
  summary: 'Order - List the current user orders (authenticated)',
  responses: {
    200: jsonSuccessGetResponse(protectedOrderGetAllSchema.response),
    401: jsonErrorResponse(AppErrorCodes.UNAUTHORIZED),
  },
});

protectedOrderGetAllRoute.openapi(route, async (c) => {
  const currentUser = c.get('currentUser');
  const { status, limit, offset, sortBy, sortOrder } = c.req.valid('query');

  const getUserOrdersUseCase = mainContainer.get<GetUserOrdersUseCaseInterface>(TYPES.GetUserOrdersUseCase);
  const { items, totalCount } = await getUserOrdersUseCase.executeGetUserOrders({
    userId: currentUser?.id as string,
    status: status as OrderStatusEnum | undefined,
    limit,
    offset,
    sortBy: sortBy as OrderSortBy | undefined,
    sortOrder,
  });

  return c.json(
    {
      items: items.map((order) => OrderSerializer.serializeForList(order)),
      totalCount,
    },
    HttpStatuses.OK,
  );
});

export { protectedOrderGetAllRoute };
