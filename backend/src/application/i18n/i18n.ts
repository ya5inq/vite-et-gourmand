import i18next, { Resource, TFunction } from 'i18next';
import { injectable } from 'inversify';
import { z } from 'zod';
import { makeZodI18nMap } from 'zod-i18n-map';
import zodFr from 'zod-i18n-map/locales/fr/zod.json';

import {
  I18nInterface,
  I18nInitOptionsInterface,
  SupportedLanguage,
  ScopedTranslatorInterface,
  SUPPORTED_LANGUAGES,
  DEFAULT_LANGUAGE,
} from './i18n.interface';

@injectable()
export class I18n implements I18nInterface {
  private isInitialized = false;

  async init(options: I18nInitOptionsInterface): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    const resources: Resource = {
      fr: {
        zod: zodFr,
        translation: {
          errors: options.errorTranslations.fr,
          customValidation: options.customValidationTranslations.fr,
          success: options.successTranslations.fr,
        },
      },
    };

    await i18next.init({
      lng: DEFAULT_LANGUAGE,
      fallbackLng: DEFAULT_LANGUAGE,
      resources,
      ns: ['zod', 'translation'],
      defaultNS: 'translation',
    });

    // Set global Zod error map for standard Zod messages (type errors, etc.)
    z.setErrorMap(makeZodI18nMap({ ns: 'zod' }));

    this.isInitialized = true;
  }

  getEffectiveLanguage(language: string | null | undefined): SupportedLanguage {
    if (!language) {
      return DEFAULT_LANGUAGE;
    }
    const normalized = language.toLowerCase();
    if (SUPPORTED_LANGUAGES.includes(normalized as SupportedLanguage)) {
      return normalized as SupportedLanguage;
    }
    return DEFAULT_LANGUAGE;
  }

  /**
   * Create a scoped translator fixed to a specific language.
   * Uses i18next.getFixedT() which returns a translation function that
   * always uses the specified language, regardless of the global state.
   * This is request-safe and avoids race conditions between concurrent requests.
   */
  createScopedTranslator(language: string | null | undefined): ScopedTranslatorInterface {
    const effectiveLanguage = this.getEffectiveLanguage(language);

    const fixedT: TFunction = i18next.getFixedT(effectiveLanguage);

    const translateCustomKey = (message: string | undefined): string => {
      if (!message) {
        return fixedT('errors.INTERNAL_SERVER_ERROR', { defaultValue: 'Internal server error' });
      }
      if (message.startsWith('customValidation.') || message.startsWith('errors.')) {
        return fixedT(message, { defaultValue: message });
      }
      return message;
    };

    return {
      language: effectiveLanguage,

      t: (key: string, options?: { defaultValue?: string }): string => {
        return fixedT(key, options);
      },

      translateZodErrors: (errors: z.ZodIssue[]): z.ZodIssue[] => {
        if (!this.isInitialized) {
          return errors;
        }

        return errors.map((issue) => ({
          ...issue,
          message: translateCustomKey(issue.message),
        }));
      },
    };
  }
}

// Singleton instance for initialization only.
// For request-scoped translations, use createScopedTranslator() and store in context.
export const i18n = new I18n();
