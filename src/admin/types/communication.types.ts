/**
 * Communication Types
 * Email, SMS, OTP, and notification structures
 */

export type CommunicationType = 'EMAIL' | 'SMS' | 'OTP' | 'SYSTEM';

export type CommunicationStatus = 'SENT' | 'FAILED' | 'PENDING' | 'BOUNCED';

export type EmailTemplateId =
  | 'APPT_CONFIRMATION_ATTORNEY'
  | 'APPT_CONFIRMATION_EXPERT'
  | 'APPT_CONFIRMATION_CLAIMANT'
  | 'APPT_REMINDER_24H'
  | 'APPT_REMINDER_1H'
  | 'REPORT_SUBMITTED_NOTIFY'
  | 'REPORT_READY_ATTORNEY'
  | 'INVOICE_SENT'
  | 'INVOICE_OVERDUE'
  | 'INVOICE_OVERDUE_FINAL'
  | 'PASSWORD_RESET'
  | 'ACCOUNT_CREATED'
  | 'APPOINTMENT_CANCELLED';

export interface CommunicationLog {
  id: string;
  appointment_id: string | null;
  user_id: string;
  type: CommunicationType;
  recipient: string; // Email or phone number
  subject: string | null;
  message_body: string;
  status: CommunicationStatus;
  error_message: string | null;
  sent_at: string | null;
  failed_at: string | null;
  retry_count: number;
  created_at: string;
  updated_at: string;
}

export interface EmailTemplate {
  id: string;
  template_id: EmailTemplateId;
  subject: string;
  html_body: string;
  plain_text_body: string;
  variables: string[]; // Array of variable names e.g. ['{{claimant_name}}', '{{appointment_date}}']
  created_at: string;
  updated_at: string;
}

export interface OTPVerification {
  id: string;
  user_id: string;
  email: string;
  otp_code: string;
  purpose: 'LOGIN' | 'PASSWORD_RESET' | 'ACCOUNT_SETUP';
  expires_at: string;
  verified_at: string | null;
  attempt_count: number;
  failed_at: string | null;
  created_at: string;
}

export interface SendEmailRequest {
  to: string;
  template_id: EmailTemplateId;
  variables: Record<string, string>;
  appointment_id?: string;
}

export interface SendOTPRequest {
  email: string;
  purpose: 'LOGIN' | 'PASSWORD_RESET' | 'ACCOUNT_SETUP';
}

export interface SendSMSRequest {
  phone_number: string;
  message: string;
  appointment_id?: string;
}

export interface InternalNote {
  id: string;
  appointment_id: string;
  author_id: string;
  author_name: string;
  content: string;
  is_visible_to_external: boolean;
  created_at: string;
  updated_at: string;
}

export interface NotificationPayload {
  user_id: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
  title: string;
  body: string;
  link?: string; // Optional navigation link
  icon?: string; // Optional icon identifier
}

export const OTP_EXPIRY_MINUTES = 10;
export const MAX_OTP_ATTEMPTS = 5;
