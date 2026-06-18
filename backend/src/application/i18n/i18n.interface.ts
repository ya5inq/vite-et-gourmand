import { z } from 'zod';

export type SupportedLanguage = 'fr';

export interface ErrorTranslationsInterface {
  [key: string]: string;
}

export interface CustomValidationTranslationsInterface {
  [key: string]: string;
}

export interface SuccessTranslationsInterface {
  [key: string]: string;
}

export interface I18nInitOptionsInterface {
  errorTranslations: Record<SupportedLanguage, ErrorTranslationsInterface>;
  customValidationTranslations: Record<SupportedLanguage, CustomValidationTranslationsInterface>;
  successTranslations: Record<SupportedLanguage, SuccessTranslationsInterface>;
}

/**
 * Scoped translator interface - fixed to a specific language.
 * This is request-safe and does not modify global state.
 */
export interface ScopedTranslatorInterface {
  /**
   * Translate a key using the fixed language.
   */
  t: (key: string, options?: { defaultValue?: string }) => string;

  /**
   * Translate Zod validation errors using the fixed language.
   */
  translateZodErrors: (errors: z.ZodIssue[]) => z.ZodIssue[];

  /**
   * The language this translator is fixed to.
   */
  language: SupportedLanguage;
}

export interface I18nInterface {
  /**
   * Initialize i18n with translations.
   * Call this once at application startup.
   */
  init(options: I18nInitOptionsInterface): Promise<void>;

  /**
   * Get effective language (fallback to default if not supported).
   */
  getEffectiveLanguage(language: string | null | undefined): SupportedLanguage;

  /**
   * Create a scoped translator fixed to a specific language.
   * This is request-safe and should be stored in request context.
   */
  createScopedTranslator(language: string | null | undefined): ScopedTranslatorInterface;
}

export const SUPPORTED_LANGUAGES: SupportedLanguage[] = ['fr'];
export const DEFAULT_LANGUAGE: SupportedLanguage = 'fr';
