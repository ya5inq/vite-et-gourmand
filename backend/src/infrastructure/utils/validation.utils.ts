import { validate as isValidUuid } from 'uuid';

export const isUuid = (value: string): boolean => {
  return isValidUuid(value);
};
