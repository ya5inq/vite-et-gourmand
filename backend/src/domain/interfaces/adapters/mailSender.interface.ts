export interface SendRegisterEmailOptions {
  email: string;
  tokenValue: string;
}

export interface SendResetPasswordEmailOptions {
  email: string;
  tokenValue: string;
}

/**
 * Sent to an employee invited to set their password (Phase 7).
 */
export interface SendEmployeeSetPasswordEmailOptions {
  email: string;
  tokenValue: string;
}

export interface SendContactEmailOptionsInterface {
  fromName: string;
  fromEmail: string;
  message: string;
  phone?: string;
  subject?: string;
}

export interface SendOrderConfirmationEmailOptions {
  email: string;
  orderId: string;
  customerName: string | null;
  totalPrice: number;
  deliveryFee: number;
  deliveryDate: Date | null;
}

/**
 * Sent when an order enters AWAITING_MATERIAL_RETURN: the customer must return
 * the rented material within 10 business days, otherwise a 600€ fee applies (CGV).
 */
export interface SendMaterialReturnEmailOptions {
  email: string;
  orderId: string;
  customerName: string | null;
  deadline: Date;
  penaltyAmount: number;
}

/**
 * Sent when an order is COMPLETED: invite the customer to leave a review.
 */
export interface SendOrderCompletedEmailOptions {
  email: string;
  orderId: string;
  customerName: string | null;
}

/**
 * Sent when the 600€ material-return penalty has been charged.
 */
export interface SendMaterialPenaltyEmailOptions {
  email: string;
  orderId: string;
  customerName: string | null;
  penaltyAmount: number;
}

export interface MailSenderInterface {
  sendRegisterEmail: (options: SendRegisterEmailOptions) => Promise<void>;
  sendResetPasswordEmail: (options: SendResetPasswordEmailOptions) => Promise<void>;
  sendEmployeeSetPasswordEmail: (options: SendEmployeeSetPasswordEmailOptions) => Promise<void>;
  sendOrderConfirmationEmail: (options: SendOrderConfirmationEmailOptions) => Promise<void>;
  sendMaterialReturnEmail: (options: SendMaterialReturnEmailOptions) => Promise<void>;
  sendOrderCompletedEmail: (options: SendOrderCompletedEmailOptions) => Promise<void>;
  sendMaterialPenaltyEmail: (options: SendMaterialPenaltyEmailOptions) => Promise<void>;
  /** Sent to the company inbox when a visitor submits the contact form. */
  sendContactEmail: (options: SendContactEmailOptionsInterface) => Promise<void>;
}
