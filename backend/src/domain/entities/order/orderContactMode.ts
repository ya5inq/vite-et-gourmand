/**
 * How the customer was contacted before a staff member cancelled or rejected
 * an order (ECF requirement: the team cannot cancel before contacting the
 * customer, and must record the contact mode + reason).
 */
export enum OrderContactModeEnum {
  PHONE = 'PHONE',
  EMAIL = 'EMAIL',
}

export const ORDER_CONTACT_MODE_VALUES = Object.values(OrderContactModeEnum) as [
  OrderContactModeEnum,
  ...OrderContactModeEnum[],
];

/**
 * Penalty (in euros) charged when rented material is not returned within the
 * material-return deadline (10 business days), per the CGV.
 */
export const MATERIAL_RETURN_PENALTY_AMOUNT = 600;

/** Number of business days a customer has to return rented material. */
export const MATERIAL_RETURN_BUSINESS_DAYS = 10;
