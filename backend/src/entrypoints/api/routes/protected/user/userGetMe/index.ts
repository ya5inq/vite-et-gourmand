import { createRoute } from '@hono/zod-openapi';

import { GetUserUseCaseInterface } from '@/application/useCases/user/getUser/getUser.useCase.interface';

import { mainContainer } from '@/configuration/di/mainContainer';
import { TYPES } from '@/configuration/di/types';
import { HttpStatuses } from '@/entrypoints/api/config/httpStatuses';
import { jsonSuccessGetResponse, jsonErrorResponse, AppErrorCodes } from '@/entrypoints/api/helpers/hono.helper';
import { getHonoApp } from '@/entrypoints/api/loader/getHonoApp';
import { UserSerializer } from '@/entrypoints/api/serializers/user.serializer';

import { userGetMeSchema } from './schema';

const userGetMeRoute = getHonoApp();

const route = createRoute({
  method: 'get',
  path: '/me',
  tags: ['protected', 'user'],
  operationId: 'ProtectedUserGetMe',
  summary: 'User - Get current user details',
  responses: {
    200: jsonSuccessGetResponse(userGetMeSchema.response),
    401: jsonErrorResponse(AppErrorCodes.UNAUTHORIZED),
    403: jsonErrorResponse(AppErrorCodes.FORBIDDEN),
    404: jsonErrorResponse(AppErrorCodes.NOT_FOUND),
  },
});

userGetMeRoute.openapi(route, async (c) => {
  const currentUser = c.get('currentUser');

  const getUserUseCase = mainContainer.get<GetUserUseCaseInterface>(TYPES.GetUserUseCase);
  const user = await getUserUseCase.executeGetUser({
    currentUser,
    userId: currentUser?.id as string,
    shouldBeSameUser: true,
  });

  return c.json(UserSerializer.serialize(user), HttpStatuses.OK);
});

export { userGetMeRoute };
