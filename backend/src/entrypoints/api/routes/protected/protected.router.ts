import { getHonoApp } from '@/entrypoints/api/loader/getHonoApp';
import { authorizationMiddleware } from '@/entrypoints/api/middlewares/authorization/authorization.middleware';

import { userGetMeRoute } from './user/userGetMe';
import { userUpdateMeRoute } from './user/userUpdateMe';

const protectedRouter = getHonoApp();

protectedRouter
  .use(authorizationMiddleware({ optional: false }))
  .route('/user', userGetMeRoute)
  .route('/user', userUpdateMeRoute);

export { protectedRouter };
