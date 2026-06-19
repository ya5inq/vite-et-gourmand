import { createRoute } from '@hono/zod-openapi';

import { UpsertPageContentUseCaseInterface } from '@/application/useCases/cms/upsertPageContent/upsertPageContent.useCase.interface';

import { mainContainer } from '@/configuration/di/mainContainer';
import { TYPES } from '@/configuration/di/types';
import { HttpStatuses } from '@/entrypoints/api/config/httpStatuses';
import { jsonSuccessGetResponse, jsonErrorResponse, AppErrorCodes } from '@/entrypoints/api/helpers/hono.helper';
import { getHonoApp } from '@/entrypoints/api/loader/getHonoApp';
import { PageContentSerializer } from '@/entrypoints/api/serializers/pageContent.serializer';

import { adminPageContentUpsertSchema } from './schema';

const adminPageContentUpsertRoute = getHonoApp();

const route = createRoute({
  method: 'put',
  path: '/page-content',
  request: {
    body: {
      content: {
        'application/json': {
          schema: adminPageContentUpsertSchema.body,
        },
      },
    },
  },
  tags: ['admin', 'cms'],
  operationId: 'AdminPageContentUpsert',
  summary: 'CMS - Upsert a page content section (staff)',
  responses: {
    200: jsonSuccessGetResponse(adminPageContentUpsertSchema.response),
    401: jsonErrorResponse(AppErrorCodes.UNAUTHORIZED),
    403: jsonErrorResponse(AppErrorCodes.FORBIDDEN),
  },
});

adminPageContentUpsertRoute.openapi(route, async (c) => {
  const currentUser = c.get('currentUser');
  const body = c.req.valid('json');

  const upsertPageContentUseCase = mainContainer.get<UpsertPageContentUseCaseInterface>(TYPES.UpsertPageContentUseCase);
  const pageContent = await upsertPageContentUseCase.executeUpsertPageContent({
    page: body.page,
    section: body.section,
    content: body.content,
    updatedBy: currentUser?.id ?? null,
  });

  return c.json(PageContentSerializer.serialize(pageContent), HttpStatuses.OK);
});

export { adminPageContentUpsertRoute };
