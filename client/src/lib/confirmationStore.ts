'use client';

/**
 * Order confirmation recap store (sessionStorage).
 *
 * The backend has no public "get order by id" endpoint, so the confirmation
 * page cannot re-fetch a guest order. To keep the confirmation screen working
 * for both guests and authenticated users, the checkout flow persists the recap
 * returned by the create-order response into sessionStorage keyed by order id.
 * The confirmation page reads it back. (Authenticated users could alternatively
 * re-fetch via protectedOrderGetOne, but reusing the stored recap keeps a single
 * code path and avoids an extra request.)
 */

export interface ConfirmationRecapItem {
  id: string;
  menuName: string;
  quantity: number;
  unitPrice: number;
}

export interface ConfirmationRecap {
  id: string;
  totalPrice: number;
  deliveryFee: number;
  deliveryDate: string | null;
  deliveryAddress: string | null;
  deliveryCity: string | null;
  guestName: string | null;
  guestEmail: string | null;
  items: ConfirmationRecapItem[];
}

const KEY_PREFIX = 'veg_order_recap_';

export function saveConfirmationRecap(recap: ConfirmationRecap): void {
  if (typeof window === 'undefined') return;
  try {
    window.sessionStorage.setItem(KEY_PREFIX + recap.id, JSON.stringify(recap));
  } catch {
    // sessionStorage unavailable: confirmation page will fall back gracefully.
  }
}

export function readConfirmationRecap(id: string): ConfirmationRecap | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.sessionStorage.getItem(KEY_PREFIX + id);
    return raw ? (JSON.parse(raw) as ConfirmationRecap) : null;
  } catch {
    return null;
  }
}
