/**
 * Audit & System Types
 * Audit logging, system settings, and permissions
 */

export type AuditActionType =
  // Auth actions
  | 'AUTH_LOGIN'
  | 'AUTH_LOGOUT'
  | 'AUTH_OTP_SENT'
  | 'AUTH_OTP_VERIFIED'
  | 'AUTH_PASSWORD_CHANGED'
  | 'AUTH_ACCOUNT_LOCKED'
  // Appointment actions
  | 'APPT_CREATED'
  | 'APPT_STATUS_CHANGED'
  | 'APPT_EXPERT_ASSIGNED'
  | 'APPT_RESCHEDULED'
  | 'APPT_CANCELLED'
  | 'APPT_ARCHIVED'
  | 'APPT_CHECKLIST_UPDATED'
  // Finance actions
  | 'FIN_INVOICE_GENERATED'
  | 'FIN_PAYMENT_RECORDED'
  | 'FIN_INVOICE_VOIDED'
  | 'FIN_DISCOUNT_APPLIED'
  | 'FIN_OVERDUE_ESCALATED'
  // Report actions
  | 'RPT_SUBMITTED'
  | 'RPT_REVIEWED'
  | 'RPT_APPROVED'
  | 'RPT_REVISION_REQUESTED'
  | 'RPT_DELIVERED'
  // Staff actions
  | 'STAFF_CREATED'
  | 'STAFF_UPDATED'
  | 'STAFF_DEACTIVATED'
  | 'STAFF_ROLE_CHANGED'
  // System actions
  | 'SYS_SETTINGS_CHANGED'
  | 'SYS_TEMPLATE_UPDATED'
  | 'SYS_PERMISSION_CHANGED'
  // CRM actions
  | 'CRM_ATTORNEY_CREATED'
  | 'CRM_ATTORNEY_UPDATED'
  | 'CRM_EXPERT_CREATED'
  | 'CRM_EXPERT_UPDATED';

export type EntityType =
  | 'APPOINTMENT'
  | 'INVOICE'
  | 'REPORT'
  | 'USER'
  | 'STAFF'
  | 'ATTORNEY'
  | 'EXPERT'
  | 'CLAIMANT'
  | 'SYSTEM';

export interface AuditLog {
  id: string;
  actor_id: string;
  actor_name: string;
  actor_role: string;
  action_type: AuditActionType;
  entity_type: EntityType;
  entity_id: string;
  before_state?: Record<string, unknown>;
  after_state?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

export interface AuditFilterOptions {
  actor_id?: string;
  action_type?: AuditActionType;
  entity_type?: EntityType;
  entity_id?: string;
  date_from?: string;
  date_to?: string;
  limit?: number;
  offset?: number;
}

export interface EntityHistory {
  entity_type: EntityType;
  entity_id: string;
  events: AuditLog[];
  created_at: string;
  updated_at: string;
}

export interface UserActivityLog {
  user_id: string;
  user_name: string;
  activities: AuditLog[];
  activity_count: number;
  date_range: { from: string; to: string };
}

export interface SystemSettings {
  id: string;
  company_name: string;
  company_address: string;
  vat_number: string;
  company_logo_url?: string;
  otp_expiry_minutes: number;
  max_otp_attempts: number;
  session_timeout_minutes: number;
  notification_rules: NotificationRule[];
  created_at: string;
  updated_at: string;
}

export interface NotificationRule {
  event_type: string;
  enabled: boolean;
  channels: ('EMAIL' | 'SMS' | 'IN_APP')[];
}

export interface ChecklistTemplate {
  id: string;
  appointment_type: string;
  items: ChecklistTemplateItem[];
  created_at: string;
  updated_at: string;
}

export interface ChecklistTemplateItem {
  id: string;
  label: string;
  order_index: number;
  required: boolean;
  description?: string;
}

export interface PermissionMatrix {
  [role: string]: {
    [permission: string]: boolean;
  };
}
