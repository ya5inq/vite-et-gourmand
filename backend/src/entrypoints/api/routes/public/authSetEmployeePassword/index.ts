import { createRoute } from '@hono/zod-openapi';

import { SetEmployeePasswordUseCaseInterface } from '@/application/useCases/employee/setEmployeePassword/setEmployeePassword.useCase.interface';

import { mainContainer } from '@/configuration/di/mainContainer';
import { TYPES } from '@/configuration/di/types';
import { HttpStatuses } from '@/entrypoints/api/config/httpStatuses';
import { jsonSuccessResponse, jsonErrorResponse, AppErrorCodes } from '@/entrypoints/api/helpers/hono.helper';
import { getHonoApp } from '@/entrypoints/api/loader/getHonoApp';

import { authSetEmployeePasswordBodySchema, authSetEmployeePasswordResponseSchema } from './schema';

const authSetEmployeePasswordRoute = getHonoApp();

const route = createRoute({
  method: 'post',
  path: '/set-employee-password',
  request: {
    body: {
      content: {
        'application/json': {
          schema: authSetEmployeePasswordBodySchema,
        },
      },
    },
  },
  tags: ['public', 'auth'],
  operationId: 'PublicAuthSetEmployeePassword',
  summary: 'Auth - Set employee password',
  responses: {
    200: jsonSuccessResponse('Password set successfully', authSetEmployeePasswordResponseSchema),
    400: jsonErrorResponse(AppErrorCodes.BAD_REQUEST),
    401: jsonErrorResponse(AppErrorCodes.UNAUTHORIZED),
  },
});

authSetEmployeePasswordRoute.openapi(route, async (c) => {
  const { token, newPassword } = c.req.valid('json');

  const setEmployeePasswordUseCase = mainContainer.get<SetEmployeePasswordUseCaseInterface>(
    TYPES.SetEmployeePasswordUseCase,
  );

  await setEmployeePasswordUseCase.executeSetEmployeePassword({ tokenValue: token, newPassword });

  return c.json({ message: 'Password set successfully', code: 'PASSWORD_SET_SUCCESSFULLY' }, HttpStatuses.OK);
});

export { authSetEmployeePasswordRoute };
