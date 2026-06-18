import { AnyZodObject, z } from 'zod';

import { defaultErrorResponseSchema, defaultSuccessResponseSchema } from '@/entrypoints/api/schemas/common.schema';

// Re-export for convenience in routes
export { AppSuccessCodes } from '@/application/success/app.success.codes';
export { AppErrorCodes } from '@/application/errors/app.error.codes';

interface JSONResponseInterface<T extends z.ZodSchema> {
  description: string;
  content: {
    'application/json': {
      schema: T;
    };
  };
  headers?: AnyZodObject;
}

interface JSONBodyInterface<T extends z.ZodSchema> {
  content: {
    'application/json': {
      schema: T;
    };
  };
}

/**
 * Success response helper for OpenAPI documentation
 * @param codes - Success code(s) from AppSuccessCodes
 * @param schema - Optional schema (defaults to defaultSuccessResponseSchema)
 */
export const jsonSuccessResponse = <T extends z.ZodSchema = typeof defaultSuccessResponseSchema>(
  codes: string | string[],
  schema?: T,
): JSONResponseInterface<T> => {
  const codeList = Array.isArray(codes) ? codes : [codes];
  const description = `Success: ${codeList.join(', ')}`;

  return {
    description,
    content: {
      'application/json': {
        schema: (schema ?? defaultSuccessResponseSchema) as T,
      },
    },
  };
};

/**
 * Success response helper for GET endpoints (returns data)
 * @param schema - The response schema
 */
export const jsonSuccessGetResponse = <T extends z.ZodSchema>(schema: T): JSONResponseInterface<T> => {
  return {
    description: 'Success',
    content: {
      'application/json': {
        schema,
      },
    },
  };
};

/**
 * Error response helper for OpenAPI documentation
 * @param codes - Error code(s) from AppErrorCodes
 * @param schema - Optional schema (defaults to defaultErrorResponseSchema)
 */
export const jsonErrorResponse = <T extends z.ZodSchema = typeof defaultErrorResponseSchema>(
  codes: string | string[],
  schema?: T,
): JSONResponseInterface<T> => {
  const codeList = Array.isArray(codes) ? codes : [codes];
  const prefix = codeList.length === 1 ? 'Error' : 'Errors';
  const description = `${prefix}: ${codeList.join(', ')}`;

  return {
    description,
    content: {
      'application/json': {
        schema: (schema ?? defaultErrorResponseSchema) as T,
      },
    },
  };
};

export const jsonBody = <T extends z.ZodSchema>(schema: T): JSONBodyInterface<T> => {
  return {
    content: {
      'application/json': {
        schema,
      },
    },
  };
};
