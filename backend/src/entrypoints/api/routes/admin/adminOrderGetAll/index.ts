import { createRoute } from '@hono/zod-openapi';

import { GetAllOrdersUseCaseInterface } from '@/application/useCases/order/getAllOrders/getAllOrders.useCase.interface';
import { OrderSortBy } from '@/domain/interfaces/repositories/order.repository.interface';

import { mainContainer } from '@/configuration/di/mainContainer';
import { TYPES } from '@/configuration/di/types';
import { OrderStatusEnum } from '@/domain/entities/order/orderStatus';
import { HttpStatuses } from '@/entrypoints/api/config/httpStatuses';
import { jsonSuccessGetResponse, jsonErrorResponse, AppErrorCodes } from '@/entrypoints/api/helpers/hono.helper';
import { getHonoApp } from '@/entrypoints/api/loader/getHonoApp';
import { OrderSerializer } from '@/entrypoints/api/serializers/order.serializer';

import { adminOrderGetAllSchema } from './schema';

const adminOrderGetAllRoute = getHonoApp();

const route = createRoute({
  method: 'get',
  path: '/order',
  request: {
    query: adminOrderGetAllSchema.query,
  },
  tags: ['admin', 'order'],
  operationId: 'AdminOrderGetAll',
  summary: 'Order - List (admin)',
  responses: {
    200: jsonSuccessGetResponse(adminOrderGetAllSchema.response),
    401: jsonErrorResponse(AppErrorCodes.UNAUTHORIZED),
    403: jsonErrorResponse(AppErrorCodes.FORBIDDEN),
  },
});

adminOrderGetAllRoute.openapi(route, async (c) => {
  const { status, search, limit, offset, sortBy, sortOrder } = c.req.valid('query');

  const getAllOrdersUseCase = mainContainer.get<GetAllOrdersUseCaseInterface>(TYPES.GetAllOrdersUseCase);
  const { items, totalCount } = await getAllOrdersUseCase.executeGetAllOrders({
    status: status as OrderStatusEnum | undefined,
    search,
    limit,
    offset,
    sortBy: sortBy as OrderSortBy | undefined,
    sortOrder,
  });

  return c.json(
    {
      items: items.map((order) => OrderSerializer.serializeForStaffList(order)),
      totalCount,
    },
    HttpStatuses.OK,
  );
});

export { adminOrderGetAllRoute };
