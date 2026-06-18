import { AsyncLocalStorage } from 'async_hooks';

import { every } from 'hono/combine';
import { createMiddleware } from 'hono/factory';
import { requestId as honoRequestId } from 'hono/request-id';

export interface RequestContextInterface {
  requestId?: string;
  traceId?: string;
  spanId?: string;
}

export const asyncLocalStorage = new AsyncLocalStorage<RequestContextInterface>();

const storeRequestId = createMiddleware(async (c, next) => {
  const requestId = c.get('requestId');

  // Extract Cloud Run trace context from X-Cloud-Trace-Context header
  // Format: TRACE_ID/SPAN_ID;o=TRACE_TRUE
  const traceHeader = c.req.header('x-cloud-trace-context');
  let traceId: string | undefined;
  let spanId: string | undefined;

  if (traceHeader) {
    const [trace, span] = traceHeader.split('/');
    traceId = trace;
    spanId = span?.split(';')[0];
  }

  await asyncLocalStorage.run({ requestId, traceId, spanId }, async () => {
    await next();
  });
});

export const requestIdMiddleware = every(honoRequestId(), storeRequestId);
