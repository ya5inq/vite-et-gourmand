import { createRoute } from '@hono/zod-openapi';

import { ResendValidationEmailUseCaseInterface } from '@/application/useCases/auth/resendValidationEmail/resendValidationEmail.useCase.interface';

import { mainContainer } from '@/configuration/di/mainContainer';
import { TYPES } from '@/configuration/di/types';
import { HttpStatuses } from '@/entrypoints/api/config/httpStatuses';
import { jsonSuccessResponse, jsonErrorResponse, AppErrorCodes } from '@/entrypoints/api/helpers/hono.helper';
import { getHonoApp } from '@/entrypoints/api/loader/getHonoApp';

import { authResendValidationSchema } from './schema';

const authResendValidationRoute = getHonoApp();

const route = createRoute({
  method: 'post',
  path: '/resend-validation',
  request: {
    body: {
      content: {
        'application/json': {
          schema: authResendValidationSchema.body,
        },
      },
    },
  },
  tags: ['public', 'auth'],
  operationId: 'PublicAuthResendValidation',
  summary: 'Auth - Resend validation email',
  responses: {
    200: jsonSuccessResponse('Validation email resent successfully'),
    400: jsonErrorResponse(AppErrorCodes.BAD_REQUEST),
    409: jsonErrorResponse(AppErrorCodes.CONFLICT_ACCOUNT_ALREADY_VALIDATED),
  },
});

authResendValidationRoute.openapi(route, async (c) => {
  const { email, token } = c.req.valid('json');

  const resendValidationEmailUseCase = mainContainer.get<ResendValidationEmailUseCaseInterface>(
    TYPES.ResendValidationEmailUseCase,
  );

  await resendValidationEmailUseCase.executeResendValidationEmail({ email, token });

  return c.json({ message: 'Validation email resent successfully', code: 'EMAIL_RESENT' }, HttpStatuses.OK);
});

export { authResendValidationRoute };
