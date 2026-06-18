import { getHonoApp } from '@/entrypoints/api/loader/getHonoApp';

import { healthcheckRoute } from './healthcheck';

const publicRouter = getHonoApp();

publicRouter
  // Healthcheck routes
  .route('/healthcheck', healthcheckRoute);

export { publicRouter };
