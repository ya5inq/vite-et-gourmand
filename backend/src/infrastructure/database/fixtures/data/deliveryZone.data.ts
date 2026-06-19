/**
 * Delivery zone fixtures, ported from supabase/seed.sql (section 8).
 *
 * ADAPTATION: the original Supabase schema stored a flat `delivery_fee` forfait.
 * The backend instead stores `distanceKm` (approximate road distance from
 * Bordeaux centre) and derives the fee server-side via the pricing rule:
 *   - inside Bordeaux (distanceKm = 0) → free delivery,
 *   - elsewhere → 5 € + 0,59 € per km.
 *
 * The distances below are realistic approximations (in km) from Bordeaux centre:
 *   - Bordeaux Centre (33000)        → 0   (free)
 *   - Bordeaux Rive Droite (33100)   → 0   (free, still within Bordeaux)
 *   - Merignac (33700)               → 8   → 9.72 €
 *   - Pessac (33600)                 → 6   → 8.54 €
 *   - Talence (33400)                → 5   → 7.95 €
 *   - Begles (33130)                 → 5   → 7.95 €
 *   - Gradignan (33170)              → 9   → 10.31 €
 *   - Libourne (33500)               → 30  → 22.70 €
 */

export interface DeliveryZoneFixture {
  name: string;
  postalCode: string;
  city: string;
  distanceKm: number;
  isActive: boolean;
}

export const DELIVERY_ZONES: DeliveryZoneFixture[] = [
  { name: 'Bordeaux Centre', postalCode: '33000', city: 'Bordeaux', distanceKm: 0, isActive: true },
  { name: 'Bordeaux Rive Droite', postalCode: '33100', city: 'Bordeaux', distanceKm: 0, isActive: true },
  { name: 'Merignac', postalCode: '33700', city: 'Merignac', distanceKm: 8, isActive: true },
  { name: 'Pessac', postalCode: '33600', city: 'Pessac', distanceKm: 6, isActive: true },
  { name: 'Talence', postalCode: '33400', city: 'Talence', distanceKm: 5, isActive: true },
  { name: 'Begles', postalCode: '33130', city: 'Begles', distanceKm: 5, isActive: true },
  { name: 'Gradignan', postalCode: '33170', city: 'Gradignan', distanceKm: 9, isActive: true },
  { name: 'Libourne', postalCode: '33500', city: 'Libourne', distanceKm: 30, isActive: true },
];
