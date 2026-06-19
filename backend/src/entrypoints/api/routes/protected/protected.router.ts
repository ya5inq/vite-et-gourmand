import { getHonoApp } from '@/entrypoints/api/loader/getHonoApp';
import { authorizationMiddleware } from '@/entrypoints/api/middlewares/authorization/authorization.middleware';

import { protectedOrderCreateRoute } from './order/protectedOrderCreate';
import { protectedOrderGetAllRoute } from './order/protectedOrderGetAll';
import { protectedOrderGetOneRoute } from './order/protectedOrderGetOne';
import { userGetMeRoute } from './user/userGetMe';
import { userUpdateMeRoute } from './user/userUpdateMe';

const protectedRouter = getHonoApp();

protectedRouter
  .use(authorizationMiddleware({ optional: false }))
  .route('/user', userGetMeRoute)
  .route('/user', userUpdateMeRoute)
  .route('/', protectedOrderCreateRoute)
  .route('/', protectedOrderGetAllRoute)
  .route('/', protectedOrderGetOneRoute);

export { protectedRouter };
