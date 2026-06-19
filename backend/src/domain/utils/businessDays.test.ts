import { describe, expect, it } from 'vitest';

import { addBusinessDays, isWeekend } from './businessDays';

describe('businessDays', () => {
  describe('isWeekend', () => {
    it('detects Saturday and Sunday', () => {
      // 2026-06-20 is a Saturday, 2026-06-21 a Sunday (UTC).
      expect(isWeekend(new Date('2026-06-20T00:00:00.000Z'))).toBe(true);
      expect(isWeekend(new Date('2026-06-21T00:00:00.000Z'))).toBe(true);
    });

    it('returns false on weekdays', () => {
      // 2026-06-22 is a Monday.
      expect(isWeekend(new Date('2026-06-22T00:00:00.000Z'))).toBe(false);
    });
  });

  describe('addBusinessDays', () => {
    it('adds 10 business days skipping weekends', () => {
      // Monday 2026-06-15 + 10 business days = Monday 2026-06-29.
      const from = new Date('2026-06-15T09:00:00.000Z');
      const result = addBusinessDays(from, 10);
      expect(result.toISOString()).toBe('2026-06-29T09:00:00.000Z');
    });

    it('skips the weekend when starting on a Friday', () => {
      // Friday 2026-06-19 + 1 business day = Monday 2026-06-22.
      const from = new Date('2026-06-19T12:00:00.000Z');
      const result = addBusinessDays(from, 1);
      expect(result.toISOString()).toBe('2026-06-22T12:00:00.000Z');
    });

    it('preserves the time component', () => {
      const from = new Date('2026-06-15T14:30:45.000Z');
      const result = addBusinessDays(from, 5);
      // Monday + 5 business days = next Monday 2026-06-22.
      expect(result.toISOString()).toBe('2026-06-22T14:30:45.000Z');
    });

    it('does not mutate the input date', () => {
      const from = new Date('2026-06-15T09:00:00.000Z');
      addBusinessDays(from, 10);
      expect(from.toISOString()).toBe('2026-06-15T09:00:00.000Z');
    });
  });
});
