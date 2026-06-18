import { createRoute } from '@hono/zod-openapi';

import {
  UpdateUserDataInterface,
  UpdateUserUseCaseInterface,
} from '@/application/useCases/user/updateUser/updateUser.useCase.interface';

import { mainContainer } from '@/configuration/di/mainContainer';
import { TYPES } from '@/configuration/di/types';
import { HttpStatuses } from '@/entrypoints/api/config/httpStatuses';
import { jsonSuccessGetResponse, jsonErrorResponse, AppErrorCodes } from '@/entrypoints/api/helpers/hono.helper';
import { getHonoApp } from '@/entrypoints/api/loader/getHonoApp';
import { UserSerializer } from '@/entrypoints/api/serializers/user.serializer';

import { userUpdateMeSchema } from './schema';

const userUpdateMeRoute = getHonoApp();

const route = createRoute({
  method: 'put',
  path: '/me',
  request: {
    body: {
      content: {
        'application/json': {
          schema: userUpdateMeSchema.body,
        },
      },
    },
  },
  tags: ['protected', 'user'],
  operationId: 'ProtectedUserUpdateMe',
  summary: 'User - Update current user profile',
  responses: {
    200: jsonSuccessGetResponse(userUpdateMeSchema.response),
    400: jsonErrorResponse(AppErrorCodes.BAD_REQUEST),
    401: jsonErrorResponse(AppErrorCodes.UNAUTHORIZED),
    403: jsonErrorResponse(AppErrorCodes.FORBIDDEN),
    404: jsonErrorResponse(AppErrorCodes.NOT_FOUND),
  },
});

userUpdateMeRoute.openapi(route, async (c) => {
  const body = c.req.valid('json');
  const currentUser = c.get('currentUser');

  const updateUserUseCase = mainContainer.get<UpdateUserUseCaseInterface>(TYPES.UpdateUserUseCase);

  const data: UpdateUserDataInterface = {
    firstName: body.firstName,
    lastName: body.lastName,
    phone: body.phone,
    address: body.address,
    city: body.city,
    postalCode: body.postalCode,
  };

  const updatedUser = await updateUserUseCase.executeUpdateUser({
    currentUser,
    userId: currentUser?.id as string,
    data,
  });

  return c.json(UserSerializer.serialize(updatedUser), HttpStatuses.OK);
});

export { userUpdateMeRoute };
