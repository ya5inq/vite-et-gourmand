import { getHonoApp } from '@/entrypoints/api/loader/getHonoApp';
import { authorizationMiddleware } from '@/entrypoints/api/middlewares/authorization/authorization.middleware';

import { adminEmployeeCreateRoute } from './adminEmployeeCreate';
import { adminEmployeeDeactivateRoute } from './adminEmployeeDeactivate';
import { adminEmployeeGetAllRoute } from './adminEmployeeGetAll';
import { adminEmployeeReactivateRoute } from './adminEmployeeReactivate';

const adminRestrictedRouter = getHonoApp();

// Admin-only section (employees, and future admin-restricted features such as stats).
// Catalogue CRUD is reserved to staff (see admin.router); these routes require ADMIN.
adminRestrictedRouter
  .use(authorizationMiddleware({ shouldBeAdmin: true }))

  // Employee
  .route('/', adminEmployeeGetAllRoute)
  .route('/', adminEmployeeCreateRoute)
  .route('/', adminEmployeeDeactivateRoute)
  .route('/', adminEmployeeReactivateRoute);

export { adminRestrictedRouter };
