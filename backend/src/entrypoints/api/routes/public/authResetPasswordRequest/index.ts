import { createRoute } from '@hono/zod-openapi';

import { ResetPasswordUseCaseInterface } from '@/application/useCases/auth/resetPassword/resetPassword.useCase.interface';

import { mainContainer } from '@/configuration/di/mainContainer';
import { TYPES } from '@/configuration/di/types';
import { HttpStatuses } from '@/entrypoints/api/config/httpStatuses';
import { jsonSuccessResponse } from '@/entrypoints/api/helpers/hono.helper';
import { getHonoApp } from '@/entrypoints/api/loader/getHonoApp';

import { authResetPasswordRequestSchema } from './schema';

const authResetPasswordRequestRoute = getHonoApp();

const route = createRoute({
  method: 'post',
  path: '/reset-password-request',
  request: {
    body: {
      content: {
        'application/json': {
          schema: authResetPasswordRequestSchema.body,
        },
      },
    },
  },
  tags: ['public', 'auth'],
  operationId: 'PublicAuthResetPasswordRequest',
  summary: 'Auth - Request password reset',
  responses: {
    200: jsonSuccessResponse('Reset password email sent successfully'),
  },
});

authResetPasswordRequestRoute.openapi(route, async (c) => {
  const { email } = c.req.valid('json');

  const resetPasswordUseCase = mainContainer.get<ResetPasswordUseCaseInterface>(TYPES.ResetPasswordRequestUseCase);

  await resetPasswordUseCase.executeResetPasswordRequest(email);
  return c.json({ message: 'Email sent', code: 'EMAIL_SENT' }, HttpStatuses.OK);
});

export { authResetPasswordRequestRoute };
