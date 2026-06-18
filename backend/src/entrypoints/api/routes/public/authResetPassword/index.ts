import { createRoute } from '@hono/zod-openapi';

import { ResetPasswordUseCaseInterface } from '@/application/useCases/auth/resetPassword/resetPassword.useCase.interface';

import { mainContainer } from '@/configuration/di/mainContainer';
import { TYPES } from '@/configuration/di/types';
import { HttpStatuses } from '@/entrypoints/api/config/httpStatuses';
import { jsonSuccessResponse, jsonErrorResponse, AppErrorCodes } from '@/entrypoints/api/helpers/hono.helper';
import { getHonoApp } from '@/entrypoints/api/loader/getHonoApp';

import { authResetPasswordBodySchema, authResetPasswordResponseSchema } from './schema';

const authResetPasswordRoute = getHonoApp();

const route = createRoute({
  method: 'post',
  path: '/reset-password',
  request: {
    body: {
      content: {
        'application/json': {
          schema: authResetPasswordBodySchema,
        },
      },
    },
  },
  tags: ['public', 'auth'],
  operationId: 'PublicAuthResetPassword',
  summary: 'Auth - Reset password',
  responses: {
    200: jsonSuccessResponse('Password reset successfully', authResetPasswordResponseSchema),
    400: jsonErrorResponse(AppErrorCodes.BAD_REQUEST),
    401: jsonErrorResponse(AppErrorCodes.UNAUTHORIZED),
  },
});

authResetPasswordRoute.openapi(route, async (c) => {
  const { token, password } = c.req.valid('json');

  const resetPasswordUseCase = mainContainer.get<ResetPasswordUseCaseInterface>(TYPES.ResetPasswordUseCase);

  await resetPasswordUseCase.executeResetPassword(token, password);

  return c.json({ message: 'Password reset successfully', code: 'PASSWORD_RESET_SUCCESSFULLY' }, HttpStatuses.OK);
});

export { authResetPasswordRoute };
