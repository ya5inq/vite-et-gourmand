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
}

export interface MailSenderInterface {
  sendRegisterEmail: (options: SendRegisterEmailOptions) => Promise<void>;
  sendResetPasswordEmail: (options: SendResetPasswordEmailOptions) => Promise<void>;
  sendEmployeeSetPasswordEmail: (options: SendEmployeeSetPasswordEmailOptions) => Promise<void>;
}
