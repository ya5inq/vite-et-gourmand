import { merge, omit, omitBy, unset, cloneDeep } from 'lodash';

/**
 * Removes all keys with undefined values from an object
 * @param obj The object to process
 * @returns A new object with all undefined values removed
 */
export const removeUndefinedKeys = (obj: Record<string, unknown>): Record<string, unknown> => {
  const result: Record<string, unknown> = {};
  Object.keys(obj).forEach((key) => {
    if (obj[key] !== undefined) {
      result[key] = obj[key];
    }
  });
  return result;
};

/**
 * Deeply merges multiple objects into a new object using lodash
 */
export const deepMerge = <T extends Record<string, unknown>>(target: T, ...sources: Array<Partial<T>>): T => {
  return merge(cloneDeep(target), ...sources) as T;
};

/**
 * Deeply removes specified keys from an object using lodash
 */
export const deepRemoveKeys = (obj: Record<string, unknown>, keysToRemove: string[]): Record<string, unknown> => {
  const result = cloneDeep(obj);

  keysToRemove.forEach((keyPath) => {
    unset(result, keyPath);
  });

  return result;
};

/**
 * Removes specified keys from an object (shallow) using lodash
 */
export const removeKeys = (obj: Record<string, unknown>, keysToRemove: string[]): Record<string, unknown> => {
  return omit(obj, keysToRemove);
};

/**
 * Removes keys based on a predicate function (shallow) using lodash
 */
export const removeBy = (
  obj: Record<string, unknown>,
  predicate: (value: unknown, key: string) => boolean,
): Record<string, unknown> => {
  return omitBy(obj, predicate);
};
