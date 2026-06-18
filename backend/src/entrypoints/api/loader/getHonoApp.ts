import { OpenAPIHono } from '@hono/zod-openapi';
import { Env } from 'hono';
import { ZodError } from 'zod';

import { ScopedTranslatorInterface } from '@/application/i18n/i18n.interface';

import { AppErrorCodes } from '@/application/errors/app.error.codes';

export interface CustomEnvInterface extends Env {
  Variables: {
    /**
     * Authenticated user, set by the authentication middleware (added in a later phase).
     * Phase 0 keeps it as `unknown` since no user entity exists yet.
     */
    currentUser?: unknown;
    userLanguage?: string | null;
    /**
     * Request-scoped translator.
     * Fixed to the user's language and safe for concurrent requests.
     * Use this for all translations instead of the global i18n instance.
     */
    translator?: ScopedTranslatorInterface;
  };
}

export const getHonoApp = (): OpenAPIHono<CustomEnvInterface> => {
  const app = new OpenAPIHono<CustomEnvInterface>({
    defaultHook: (result, c): Response | undefined => {
      if (!result.success) {
        // Use request-scoped translator from context (set by acceptLanguage middleware)
        const translator = c.get('translator');

        const translatedErrors = translator ? translator.translateZodErrors(result.error.errors) : result.error.errors;
        const translatedMessage = translator
          ? translator.t('errors.BAD_REQUEST', { defaultValue: 'Validation error' })
          : 'Validation error';

        return c.json(
          {
            message: translatedMessage,
            code: AppErrorCodes.BAD_REQUEST,
            errors: formatZodErrors(result.error, translatedErrors),
          },
          400,
        );
      }
    },
  });
  return app;
};

interface BadRequestDetailErrorsInterface {
  message: string;
  code: string;
  path: (string | number)[];
}

const formatZodErrors = (
  zodError: ZodError,
  translatedIssues: ZodError['issues'],
): BadRequestDetailErrorsInterface[] => {
  return translatedIssues.map((issue, index) => {
    return {
      message: issue.message,
      code: zodError.issues[index].code,
      path: issue.path,
    };
  });
};
