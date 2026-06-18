import { ErrorHandler } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { ZodError } from 'zod';

import { AppErrorCodes, getHttpStatusFromErrorCode } from '@/application/errors/app.error.interface';
import { ScopedTranslatorInterface } from '@/application/i18n/i18n.interface';

import { Logger } from '@/adapters/logger/logger';
import { isAppError } from '@/application/errors/error.util';

import { HttpStatuses } from '../../config/httpStatuses';
import { CustomEnvInterface } from '../../loader/getHonoApp';

const isDev = process.env.NODE_ENV !== 'production';

/**
 * Translate an error code using the request-scoped translator.
 * Falls back to the error code itself if translator is not available or no translation found.
 */
const translateErrorCode = (code: AppErrorCodes, translator: ScopedTranslatorInterface | undefined): string => {
  if (!translator) {
    return code;
  }
  const translationKey = `errors.${code}`;
  return translator.t(translationKey, { defaultValue: code });
};

export const appErrorMiddleware: ErrorHandler<CustomEnvInterface> = (error, c) => {
  const appLogger = new Logger();
  // Get request-scoped translator from context (set by acceptLanguage middleware)
  const translator = c.get('translator');

  if (isAppError(error)) {
    const { code, context, message: rawMessage } = error;
    const translatedMessage = translateErrorCode(code, translator);
    const statusCode = getHttpStatusFromErrorCode(code);

    // Don't log expected client errors (4xx)
    if (statusCode >= HttpStatuses.INTERNAL_SERVER_ERROR) {
      appLogger.error(rawMessage, error);
    } else {
      appLogger.debug(rawMessage, { code, context });
    }

    return c.json(
      {
        message: translatedMessage,
        code,
        context,
        ...(isDev && { rawMessage }),
      },
      statusCode,
    );
  }

  if (error instanceof HTTPException) {
    appLogger.debug(error.message, { error });
    return c.json({ message: error.message, code: error.status }, error.status);
  }

  if (error instanceof ZodError) {
    const translatedErrors = translator ? translator.translateZodErrors(error.errors) : error.errors;
    const translatedMessage = translateErrorCode(AppErrorCodes.BAD_REQUEST, translator);
    return c.json(
      {
        message: translatedMessage,
        statusCode: HttpStatuses.BAD_REQUEST,
        code: AppErrorCodes.BAD_REQUEST,
        context: translatedErrors,
      },
      HttpStatuses.BAD_REQUEST,
    );
  }

  appLogger.error(error.message, error);
  const translatedMessage = translateErrorCode(AppErrorCodes.INTERNAL_SERVER_ERROR, translator);
  return c.json(
    {
      message: translatedMessage,
      code: AppErrorCodes.INTERNAL_SERVER_ERROR,
      ...(isDev && { rawMessage: error.message }),
    },
    HttpStatuses.INTERNAL_SERVER_ERROR,
  );
};
