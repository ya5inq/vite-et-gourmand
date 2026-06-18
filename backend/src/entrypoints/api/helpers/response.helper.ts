import { Context } from 'hono';
import { z } from 'zod';

import { AppSuccessCodes, AppSuccessCodesType } from '@/application/success/app.success.codes';

import { HttpCodes } from '../config/httpCode';
import { CustomEnvInterface } from '../loader/getHonoApp';
import { defaultErrorResponseSchema } from '../schemas/common.schema';

type DefaultErrorResponse = z.infer<typeof defaultErrorResponseSchema>;

// Helper to get translator from context
const getTranslator = (c: Context<CustomEnvInterface>) => c.get('translator');

// =============================================================================
// SUCCESS RESPONSES (i18n)
// =============================================================================

/**
 * Create a translated success response.
 * Uses the request-scoped translator from Hono context.
 *
 * @param c - The Hono context
 * @param code - The success code (determines the translated message)
 * @param responseContext - Optional response context (e.g., { id: 'uuid' })
 */
// Overload: with context (context is required in return type)
export function successResponse<T extends Record<string, unknown>>(
  c: Context<CustomEnvInterface>,
  code: AppSuccessCodesType,
  responseContext: T,
): { message: string; code: AppSuccessCodesType; context: T };
// Overload: without context (no context in return type)
export function successResponse(
  c: Context<CustomEnvInterface>,
  code: AppSuccessCodesType,
): { message: string; code: AppSuccessCodesType };
// Implementation
export function successResponse<T extends Record<string, unknown>>(
  c: Context<CustomEnvInterface>,
  code: AppSuccessCodesType,
  responseContext?: T,
): { message: string; code: AppSuccessCodesType; context?: T } {
  const translator = getTranslator(c);
  const translationKey = `success.${code}`;
  const message = translator ? translator.t(translationKey, { defaultValue: code }) : code;

  return {
    message,
    code,
    ...(responseContext && { context: responseContext }),
  };
}

export { AppSuccessCodes };

// =============================================================================
// ERROR RESPONSES (i18n)
// =============================================================================

/**
 * Create a translated "Forbidden" error response.
 */
export const defaultForbiddenResponse = (c: Context<CustomEnvInterface>): DefaultErrorResponse => {
  const translator = getTranslator(c);
  return {
    message: translator ? translator.t('errors.FORBIDDEN', { defaultValue: 'Access forbidden' }) : 'Access forbidden',
    code: HttpCodes.FORBIDDEN,
  };
};

/**
 * Create a translated "Unauthorized" error response.
 */
export const defaultUnauthorizedResponse = (c: Context<CustomEnvInterface>): DefaultErrorResponse => {
  const translator = getTranslator(c);
  return {
    message: translator ? translator.t('errors.UNAUTHORIZED', { defaultValue: 'Unauthorized' }) : 'Unauthorized',
    code: HttpCodes.UNAUTHORIZED,
  };
};

/**
 * Create a translated "Not Found" error response.
 */
export const defaultNotFoundResponse = (c: Context<CustomEnvInterface>): DefaultErrorResponse => {
  const translator = getTranslator(c);
  return {
    message: translator ? translator.t('errors.NOT_FOUND', { defaultValue: 'Entity not found' }) : 'Entity not found',
    code: HttpCodes.NOT_FOUND,
  };
};

/**
 * Create a translated "Bad Request" error response.
 */
export const defaultBadRequestResponse = (c: Context<CustomEnvInterface>): DefaultErrorResponse => {
  const translator = getTranslator(c);
  return {
    message: translator ? translator.t('errors.BAD_REQUEST', { defaultValue: 'Bad request' }) : 'Bad request',
    code: HttpCodes.BAD_REQUEST,
  };
};
