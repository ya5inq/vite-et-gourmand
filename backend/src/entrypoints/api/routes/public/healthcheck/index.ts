import { createRoute } from '@hono/zod-openapi';

import { HttpStatuses } from '@/entrypoints/api/config/httpStatuses';
import { jsonSuccessGetResponse } from '@/entrypoints/api/helpers/hono.helper';
import { getHonoApp } from '@/entrypoints/api/loader/getHonoApp';

import { healthcheckResponseSchema } from './schema';

const healthcheckRoute = getHonoApp();

const route = createRoute({
  method: 'get',
  path: '/',
  tags: ['public', 'healthcheck'],
  operationId: 'PublicHealthcheck',
  summary: 'Healthcheck - Check API health',
  responses: {
    200: jsonSuccessGetResponse(healthcheckResponseSchema),
  },
});

healthcheckRoute.openapi(route, (c) => {
  return c.json(
    {
      message: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    },
    HttpStatuses.OK,
  );
});

export { healthcheckRoute };
