import { describe, expect, it } from 'vitest';

import { getHttpStatusFromErrorCode } from '@/entrypoints/api/config/httpErrorMapping';
import { HttpStatuses } from '@/entrypoints/api/config/httpStatuses';

import { AppError } from './app.error';
import { AppErrorCodes } from './app.error.codes';
import { isAppError } from './error.util';

describe('AppError', () => {
  it('derives the HTTP status from the error code prefix', () => {
    expect(getHttpStatusFromErrorCode(AppErrorCodes.NOT_FOUND)).toBe(HttpStatuses.NOT_FOUND);
    expect(getHttpStatusFromErrorCode(AppErrorCodes.BAD_REQUEST_INVALID_DATA)).toBe(HttpStatuses.BAD_REQUEST);
    expect(getHttpStatusFromErrorCode(AppErrorCodes.CONFLICT)).toBe(HttpStatuses.CONFLICT);
    expect(getHttpStatusFromErrorCode(AppErrorCodes.INTERNAL_SERVER_ERROR)).toBe(HttpStatuses.INTERNAL_SERVER_ERROR);
  });

  it('is recognized by isAppError', () => {
    const error = new AppError({
      code: AppErrorCodes.NOT_FOUND,
      message: 'not found',
      silent: true,
    });

    expect(isAppError(error)).toBe(true);
    expect(isAppError(new Error('plain'))).toBe(false);
  });
});
