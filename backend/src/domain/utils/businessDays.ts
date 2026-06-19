/**
 * Date helpers for the order state machine (Phase 6).
 *
 * Business days = Monday to Friday (Saturday and Sunday are skipped).
 * Used to compute the material-return deadline (+10 business days) when an
 * order enters AWAITING_MATERIAL_RETURN.
 */

const SATURDAY = 6;
const SUNDAY = 0;

/** True when the given date falls on a Saturday or Sunday. */
export const isWeekend = (date: Date): boolean => {
  const day = date.getUTCDay();
  return day === SATURDAY || day === SUNDAY;
};

/**
 * Returns a new Date `businessDays` working days after `from` (weekends are
 * skipped). The time component of `from` is preserved.
 */
export const addBusinessDays = (from: Date, businessDays: number): Date => {
  const result = new Date(from.getTime());
  let remaining = businessDays;

  while (remaining > 0) {
    result.setUTCDate(result.getUTCDate() + 1);
    if (!isWeekend(result)) {
      remaining -= 1;
    }
  }

  return result;
};
