/**
 * Valid HTTP error prefixes for AppErrorCodes.
 * Each prefix maps to a specific HTTP status code.
 */
export type HttpErrorPrefix =
  | 'INTERNAL_SERVER_ERROR'
  | 'DEPENDENCY_FAILED'
  | 'BAD_REQUEST'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'PAYMENT_REQUIRED'
  | 'TOO_MANY_REQUESTS';

/**
 * Valid error code format: PREFIX or PREFIX_SUBCODE
 * TypeScript will enforce this pattern at compile time.
 */
type ValidErrorCode = HttpErrorPrefix | `${HttpErrorPrefix}_${string}`;

/**
 * AppErrorCodes with compile-time naming validation.
 * Convention: {HTTP_PREFIX}_{SUBCODE}
 *
 * The `satisfies` ensures all values match the ValidErrorCode pattern.
 * The HTTP status is derived from the prefix (see httpErrorMapping.ts).
 */
export const AppErrorCodes = {
  // INTERNAL_SERVER_ERROR (500 equivalent)
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',

  // BAD_REQUEST (400 equivalent)
  BAD_REQUEST: 'BAD_REQUEST',
  BAD_REQUEST_INVALID_DATA: 'BAD_REQUEST_INVALID_DATA',

  // UNAUTHORIZED (401 equivalent)
  UNAUTHORIZED: 'UNAUTHORIZED',

  // FORBIDDEN (403 equivalent)
  FORBIDDEN: 'FORBIDDEN',

  // NOT_FOUND (404 equivalent)
  NOT_FOUND: 'NOT_FOUND',

  // CONFLICT (409 equivalent)
  CONFLICT: 'CONFLICT',

  // TOO_MANY_REQUESTS (429 equivalent)
  TOO_MANY_REQUESTS: 'TOO_MANY_REQUESTS',
} as const satisfies Record<string, ValidErrorCode>;

/**
 * Type representing any valid AppErrorCode value.
 */
export type AppErrorCodes = (typeof AppErrorCodes)[keyof typeof AppErrorCodes];
