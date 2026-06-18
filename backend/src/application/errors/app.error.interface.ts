// Re-export from codes
export { AppErrorCodes } from './app.error.codes';
// Re-export HTTP mapping from entrypoints
export { getHttpStatusFromErrorCode } from '@/entrypoints/api/config/httpErrorMapping';

import { AppErrorCodes } from './app.error.codes';

export interface AppErrorOptions {
  message: string;
  code: AppErrorCodes;
  context?: unknown;
  privateContext?: unknown;
  error?: unknown;
  silent?: boolean;
}

export interface AppErrorInterface extends Error {
  message: string;
  code: AppErrorCodes;
  context?: unknown;
  isAppError: boolean;
  error?: unknown;
  silent?: boolean;
}
