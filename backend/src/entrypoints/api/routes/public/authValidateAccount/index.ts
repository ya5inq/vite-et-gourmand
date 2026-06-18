import { createRoute } from '@hono/zod-openapi';

import { ValidateAccountUseCaseInterface } from '@/application/useCases/auth/validateAccount/validateAccount.useCase.interface';

import { mainContainer } from '@/configuration/di/mainContainer';
import { TYPES } from '@/configuration/di/types';
import { HttpStatuses } from '@/entrypoints/api/config/httpStatuses';
import { jsonSuccessResponse, jsonErrorResponse, AppErrorCodes } from '@/entrypoints/api/helpers/hono.helper';
import { getHonoApp } from '@/entrypoints/api/loader/getHonoApp';

import { authValidateAccountSchema } from './schema';

const authValidateAccountRoute = getHonoApp();

const route = createRoute({
  method: 'post',
  path: '/validate-account',
  request: {
    body: {
      content: {
        'application/json': {
          schema: authValidateAccountSchema.body,
        },
      },
    },
  },
  tags: ['public', 'auth'],
  operationId: 'PublicAuthValidateAccount',
  summary: 'Auth - Validate account',
  responses: {
    200: jsonSuccessResponse('Account validated successfully'),
    400: jsonErrorResponse(AppErrorCodes.BAD_REQUEST),
    401: jsonErrorResponse(AppErrorCodes.UNAUTHORIZED),
    409: jsonErrorResponse(AppErrorCodes.CONFLICT_ACCOUNT_ALREADY_VALIDATED),
  },
});

authValidateAccountRoute.openapi(route, async (c) => {
  const { token } = c.req.valid('json');

  const validateAccountUseCase = mainContainer.get<ValidateAccountUseCaseInterface>(TYPES.ValidateAccountUseCase);

  await validateAccountUseCase.executeValidateAccount(token);

  return c.json({ message: 'Account validated successfully', code: 'ACCOUNT_VALIDATED' }, HttpStatuses.OK);
});

export { authValidateAccountRoute };
