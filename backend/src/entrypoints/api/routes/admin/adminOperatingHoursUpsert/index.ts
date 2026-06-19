import { createRoute } from '@hono/zod-openapi';

import { UpsertOperatingHoursUseCaseInterface } from '@/application/useCases/cms/upsertOperatingHours/upsertOperatingHours.useCase.interface';

import { mainContainer } from '@/configuration/di/mainContainer';
import { TYPES } from '@/configuration/di/types';
import { HttpStatuses } from '@/entrypoints/api/config/httpStatuses';
import { jsonSuccessGetResponse, jsonErrorResponse, AppErrorCodes } from '@/entrypoints/api/helpers/hono.helper';
import { getHonoApp } from '@/entrypoints/api/loader/getHonoApp';
import { OperatingHoursSerializer } from '@/entrypoints/api/serializers/operatingHours.serializer';

import { adminOperatingHoursUpsertSchema } from './schema';

const adminOperatingHoursUpsertRoute = getHonoApp();

const route = createRoute({
  method: 'put',
  path: '/operating-hours',
  request: {
    body: {
      content: {
        'application/json': {
          schema: adminOperatingHoursUpsertSchema.body,
        },
      },
    },
  },
  tags: ['admin', 'cms'],
  operationId: 'AdminOperatingHoursUpsert',
  summary: 'CMS - Upsert operating hours (staff)',
  responses: {
    200: jsonSuccessGetResponse(adminOperatingHoursUpsertSchema.response),
    401: jsonErrorResponse(AppErrorCodes.UNAUTHORIZED),
    403: jsonErrorResponse(AppErrorCodes.FORBIDDEN),
  },
});

adminOperatingHoursUpsertRoute.openapi(route, async (c) => {
  const body = c.req.valid('json');

  const upsertOperatingHoursUseCase = mainContainer.get<UpsertOperatingHoursUseCaseInterface>(
    TYPES.UpsertOperatingHoursUseCase,
  );
  const hours = await upsertOperatingHoursUseCase.executeUpsertOperatingHours({ days: body.days });

  return c.json({ items: hours.map((entry) => OperatingHoursSerializer.serialize(entry)) }, HttpStatuses.OK);
});

export { adminOperatingHoursUpsertRoute };
