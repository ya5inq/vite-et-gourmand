import { z } from 'zod';

import { PASSWORD_SERVICE_REGEX } from '@/application/services/password/password.service';

/**
 * Password complexity schema.
 * Uses the shared PASSWORD_SERVICE_REGEX so route validation and the password
 * service stay aligned. The error message points to an i18n custom validation key.
 */
export const passwordSchema = z.string().regex(PASSWORD_SERVICE_REGEX, {
  message: 'customValidation.PASSWORD_COMPLEXITY',
});
