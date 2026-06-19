import { getHonoApp } from '@/entrypoints/api/loader/getHonoApp';
import { authorizationMiddleware } from '@/entrypoints/api/middlewares/authorization/authorization.middleware';

import { adminEmployeeCreateRoute } from './adminEmployeeCreate';
import { adminEmployeeDeactivateRoute } from './adminEmployeeDeactivate';
import { adminEmployeeGetAllRoute } from './adminEmployeeGetAll';
import { adminEmployeeReactivateRoute } from './adminEmployeeReactivate';
import { adminStatsOrdersByMenuRoute } from './adminStatsOrdersByMenu';
import { adminStatsRevenueByMenuRoute } from './adminStatsRevenueByMenu';

const adminRestrictedRouter = getHonoApp();

// Admin-only section (employees + analytics). Catalogue CRUD is reserved to
// staff (see admin.router); these routes require ADMIN.
adminRestrictedRouter
  .use(authorizationMiddleware({ shouldBeAdmin: true }))

  // Employee
  .route('/', adminEmployeeGetAllRoute)
  .route('/', adminEmployeeCreateRoute)
  .route('/', adminEmployeeDeactivateRoute)
  .route('/', adminEmployeeReactivateRoute)

  // Stats (read from MongoDB)
  .route('/', adminStatsOrdersByMenuRoute)
  .route('/', adminStatsRevenueByMenuRoute);

export { adminRestrictedRouter };
