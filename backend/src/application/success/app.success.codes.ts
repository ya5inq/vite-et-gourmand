/**
 * Success codes for i18n translated success messages.
 * Each code maps to a translation key in success.{lang}.json.
 */
export const AppSuccessCodes = {
  // CRUD générique
  ENTITY_CREATED: 'ENTITY_CREATED',
  ENTITY_UPDATED: 'ENTITY_UPDATED',
  ENTITY_DELETED: 'ENTITY_DELETED',
} as const;

export type AppSuccessCodesType = (typeof AppSuccessCodes)[keyof typeof AppSuccessCodes];
