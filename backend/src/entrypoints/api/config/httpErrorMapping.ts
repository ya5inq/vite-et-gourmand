import { AppErrorCodes, HttpErrorPrefix } from '@/application/errors/app.error.codes';

import { HttpStatuses } from './httpStatuses';

/**
 * Map from error code prefix to HTTP status.
 */
const PREFIX_TO_STATUS = {
  INTERNAL_SERVER_ERROR: HttpStatuses.INTERNAL_SERVER_ERROR,
  DEPENDENCY_FAILED: HttpStatuses.FAILED_DEPENDENCY,
  UNAUTHORIZED: HttpStatuses.UNAUTHORIZED,
  BAD_REQUEST: HttpStatuses.BAD_REQUEST,
  FORBIDDEN: HttpStatuses.FORBIDDEN,
  NOT_FOUND: HttpStatuses.NOT_FOUND,
  CONFLICT: HttpStatuses.CONFLICT,
  PAYMENT_REQUIRED: HttpStatuses.PAYMENT_REQUIRED,
  TOO_MANY_REQUESTS: HttpStatuses.TOO_MANY_REQUESTS,
} as const satisfies Record<HttpErrorPrefix, HttpStatuses>;

/**
 * Extract HTTP status from an AppErrorCode.
 * Uses the prefix naming convention to derive the status.
 */
export const getHttpStatusFromErrorCode = (code: AppErrorCodes): HttpStatuses => {
  const codeStr = String(code);

  for (const prefix of Object.keys(PREFIX_TO_STATUS) as HttpErrorPrefix[]) {
    if (codeStr === prefix || codeStr.startsWith(`${prefix}_`)) {
      return PREFIX_TO_STATUS[prefix];
    }
  }

  return HttpStatuses.INTERNAL_SERVER_ERROR;
};
