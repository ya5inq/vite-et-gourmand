import { createMiddleware } from 'hono/factory';

import { i18n } from '@/application/i18n/i18n';

import { CustomEnvInterface } from '../../loader/getHonoApp';

/**
 * Query parameter name for language override
 * Using 'ln' to avoid conflicts with routes that use 'lang' for business logic
 */
const LANG_QUERY_PARAM = 'ln';

/**
 * Extracts the primary language code (2 letters) from Accept-Language header
 */
const extractLanguageCode = (acceptLanguage: string): string => {
  const firstLang = acceptLanguage.split(',')[0].trim();
  const langMatch = firstLang.match(/^([a-z]{2})/i);

  if (langMatch) {
    return langMatch[1].toLowerCase();
  }

  return firstLang.substring(0, 2).toLowerCase();
};

/**
 * Middleware to extract user language from:
 * 1. Query parameter `ln` (highest priority, GET requests only) - removed from URL after extraction
 * 2. Accept-Language header (fallback for all requests)
 *
 * Creates a request-scoped translator that is safe for concurrent requests.
 * The translator is stored in context as `translator` and should be used
 * instead of the global i18n instance.
 */
export const acceptLanguageMiddleware = createMiddleware<CustomEnvInterface>(async (c, next) => {
  let languageCode: string | null = null;

  const isGetRequest = c.req.method === 'GET';

  // 1. Check query parameter first (highest priority, GET only)
  if (isGetRequest) {
    const url = new URL(c.req.url);
    const langFromQuery = url.searchParams.get(LANG_QUERY_PARAM);

    if (langFromQuery) {
      languageCode = langFromQuery.toLowerCase();

      // Remove the lang param from URL so validators don't reject it
      url.searchParams.delete(LANG_QUERY_PARAM);

      const cleanedRequest = new Request(url.toString(), {
        method: c.req.raw.method,
        headers: c.req.raw.headers,
      });

      (c.req as unknown as { raw: Request }).raw = cleanedRequest;
    }
  }

  // 2. Fall back to Accept-Language header
  if (!languageCode) {
    const acceptLanguageHeader = c.req.header('Accept-Language');
    if (acceptLanguageHeader) {
      languageCode = extractLanguageCode(acceptLanguageHeader);
    }
  }

  c.set('userLanguage', languageCode);

  // Create request-scoped translator using i18next.getFixedT()
  const translator = i18n.createScopedTranslator(languageCode);
  c.set('translator', translator);

  await next();
});
