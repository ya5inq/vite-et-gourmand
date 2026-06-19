import { createRoute } from '@hono/zod-openapi';

import { DeactivateEmployeeUseCaseInterface } from '@/application/useCases/employee/deactivateEmployee/deactivateEmployee.useCase.interface';

import { mainContainer } from '@/configuration/di/mainContainer';
import { TYPES } from '@/configuration/di/types';
import { HttpStatuses } from '@/entrypoints/api/config/httpStatuses';
import { jsonSuccessGetResponse, jsonErrorResponse, AppErrorCodes } from '@/entrypoints/api/helpers/hono.helper';
import { getHonoApp } from '@/entrypoints/api/loader/getHonoApp';
import { UserSerializer } from '@/entrypoints/api/serializers/user.serializer';

import { adminEmployeeDeactivateSchema } from './schema';

const adminEmployeeDeactivateRoute = getHonoApp();

const route = createRoute({
  method: 'post',
  path: '/employee/{id}/deactivate',
  request: {
    params: adminEmployeeDeactivateSchema.params,
  },
  tags: ['admin', 'employee'],
  operationId: 'AdminEmployeeDeactivate',
  summary: 'Employee - Deactivate (admin)',
  responses: {
    200: jsonSuccessGetResponse(adminEmployeeDeactivateSchema.response),
    400: jsonErrorResponse(AppErrorCodes.BAD_REQUEST_CANNOT_DEACTIVATE_ADMIN),
    401: jsonErrorResponse(AppErrorCodes.UNAUTHORIZED),
    403: jsonErrorResponse(AppErrorCodes.FORBIDDEN),
    404: jsonErrorResponse(AppErrorCodes.NOT_FOUND_USER),
  },
});

adminEmployeeDeactivateRoute.openapi(route, async (c) => {
  const currentUser = c.get('currentUser');
  const { id } = c.req.valid('param');

  const deactivateEmployeeUseCase = mainContainer.get<DeactivateEmployeeUseCaseInterface>(
    TYPES.DeactivateEmployeeUseCase,
  );
  const employee = await deactivateEmployeeUseCase.executeDeactivateEmployee({
    employeeId: id,
    actorId: currentUser?.id ?? null,
    actorRole: currentUser?.role ?? null,
  });

  return c.json(UserSerializer.serialize(employee), HttpStatuses.OK);
});

export { adminEmployeeDeactivateRoute };
