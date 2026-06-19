import { ValueTransformer } from 'typeorm';

/**
 * TypeORM maps `numeric`/`decimal` columns to `string` by default to avoid
 * floating-point precision loss. For our catalog prices a JS `number` is the
 * convenient and expected domain type, so this transformer converts:
 *  - on read (from): the DB string -> number (null stays null)
 *  - on write (to): keeps the number (TypeORM serializes it back to the column)
 */
export const decimalTransformer: ValueTransformer = {
  to: (value: number | null | undefined): number | null | undefined => value,
  from: (value: string | null): number | null => (value === null || value === undefined ? null : parseFloat(value)),
};
