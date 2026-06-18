import { ServerType, serve } from '@hono/node-server';
import { swaggerUI } from '@hono/swagger-ui';
import { OpenAPIHono } from '@hono/zod-openapi';
import { apiReference } from '@scalar/hono-api-reference';
import { compress } from 'hono/compress';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { prettyJSON } from 'hono/pretty-json';

import { EnvConfigInterface } from '@/domain/interfaces/adapters/envConfig.interface';
import { LoggerInterface } from '@/domain/interfaces/logger/logger.interface';

import { mainContainer } from '@/configuration/di/mainContainer';
import { TYPES } from '@/configuration/di/types';

import { CustomEnvInterface, getHonoApp } from './getHonoApp';
import { acceptLanguageMiddleware } from '../middlewares/acceptLanguage/acceptLanguage.middleware';
import { apiDocMiddleware } from '../middlewares/apiDoc/apiDoc.middleware';
import { appErrorMiddleware } from '../middlewares/appError/appError.middleware';
import { authenticationMiddleware } from '../middlewares/authentication/authentication.middleware';
import { requestIdMiddleware } from '../middlewares/requestId/requestId.middleware';
import { routes } from '../routes/router';

interface BootstrapOptionsInterface {
  port?: number;
}

export const bootstrap = (
  options?: BootstrapOptionsInterface,
): { app: OpenAPIHono<CustomEnvInterface>; server: ServerType } => {
  const envConfig = mainContainer.get<EnvConfigInterface>(TYPES.EnvConfig);

  // Allowed CORS origins: the public frontend and the back-office.
  const allowedOrigins = [envConfig.frontendUrl, envConfig.backOfficeUrl].filter(Boolean);

  const app = getHonoApp();
  app
    .use(compress())
    .use(
      '*',
      cors({
        origin: (origin) => (allowedOrigins.includes(origin) ? origin : allowedOrigins[0] ?? null),
        credentials: true,
      }),
    )
    .use(logger())
    .use(prettyJSON())
    .use(requestIdMiddleware)
    .use(acceptLanguageMiddleware)
    .use(authenticationMiddleware)
    .route('/api', routes);

  app.onError(appErrorMiddleware);
  app.doc('api/doc', apiDocMiddleware);
  app.get('/ui', swaggerUI({ url: '/api/doc' }));
  app.get('/reference', apiReference({ spec: { url: '/api/doc' } }));
  const appLogger = mainContainer.get<LoggerInterface>(TYPES.Logger);

  const port = options?.port ?? envConfig.port;
  const server = serve({ fetch: app.fetch, port }, () => {
    appLogger.info(`Server is running on port ${port}`);
  });

  return { app, server };
};
