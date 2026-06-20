/**
 * Appointment Types
 * Core type definitions for the appointment lifecycle and related entities
 */

export type AppointmentStatus =
  | 'DRAFT'
  | 'PENDING_APPROVAL'
  | 'APPROVED'
  | 'REJECTED'
  | 'SCHEDULED'
  | 'CONFIRMED'
  | 'IN_PROGRESS'
  | 'ASSESSMENT_PENDING'
  | 'ASSESSMENT_COMPLETE'
  | 'REPORT_PENDING'
  | 'REPORT_SUBMITTED'
  | 'REPORT_REVIEWED'
  | 'INVOICE_PENDING'
  | 'INVOICE_SENT'
  | 'PAID'
  | 'OVERDUE'
  | 'ESCALATED'
  | 'ARCHIVED'
  | 'CANCELLED';

export type AppointmentType =
  | 'ORTHOPAEDIC'
  | 'PSYCHIATRIC'
  | 'NEUROLOGICAL'
  | 'GENERAL_PRACTICE'
  | 'OCCUPATIONAL_THERAPY'
  | 'PHYSIOTHERAPY'
  | 'RADIOLOGICAL'
  | 'OTHER';

export interface ClaimantSummary {
  id: string;
  full_name: string;
  id_number: string;
  contact: string;
  address: string;
  injury_description: string;
}

export interface AttorneySummary {
  id: string;
  firm_name: string;
  attorney_name: string;
  contact: string;
  matter_reference: string;
}

export interface ExpertSummary {
  id: string;
  full_name: string;
  specialisation: string;
  practice_number: string;
  availability_confirmed: boolean;
}

export interface ChecklistItem {
  id: string;
  label: string;
  required: boolean;
  completed: boolean;
  completed_at: string | null;
  completed_by: string | null;
}

export interface Assessment {
  submitted_at: string;
  findings: string;
  diagnosis_codes: string[];
  expert_notes: string;
  attachments: Document[];
}

export interface Report {
  status: 'PENDING' | 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'REVISION_REQUESTED' | 'DELIVERED';
  submitted_at: string | null;
  reviewed_at: string | null;
  download_url: string | null;
  version_history: ReportVersion[];
}

export interface ReportVersion {
  version_number: number;
  submitted_at: string;
  file_url: string;
  status: string;
}

export interface InvoiceRecord {
  invoice_number: string;
  amount_cents: number;
  vat_cents: number;
  total_cents: number;
  paid_at: string | null;
  payment_method: string | null;
  receipt_url: string | null;
  status: 'DRAFT' | 'SENT' | 'PAID' | 'OVERDUE' | 'ESCALATED' | 'VOIDED';
}

export interface CommunicationEntry {
  id: string;
  type: 'EMAIL' | 'SMS' | 'OTP' | 'SYSTEM';
  recipient: string;
  subject: string;
  message: string;
  sent_at: string;
  status: 'SENT' | 'FAILED';
}

export interface InternalNote {
  id: string;
  content: string;
  created_by: string;
  created_at: string;
}

export interface TimelineEvent {
  id: string;
  event_type: string;
  actor_id: string;
  actor_name: string;
  timestamp: string;
  description: string;
  metadata?: Record<string, unknown>;
}

export interface Document {
  id: string;
  file_name: string;
  file_type: string;
  file_size: number;
  doc_type: 'REFERRAL_LETTER' | 'ID_DOCUMENT' | 'MEDICAL_RECORDS' | 'ASSESSMENT_FORM' | 'MEDICO_LEGAL_REPORT' | 'INVOICE' | 'RECEIPT' | 'COURT_ORDER' | 'CONSENT_FORM' | 'OTHER';
  storage_path: string;
  uploaded_at: string;
  uploaded_by: string;
}

export interface AppointmentMasterRecord {
  id: string;
  reference_number: string;
  status: AppointmentStatus;
  appointment_type: AppointmentType;
  appointment_datetime: string;
  venue: string;
  duration_minutes: number;
  claimant: ClaimantSummary;
  attorney: AttorneySummary;
  expert: ExpertSummary | null;
  checklist: ChecklistItem[];
  assessment: Assessment | null;
  report: Report | null;
  finance: InvoiceRecord | null;
  communications: CommunicationEntry[];
  notes: InternalNote[];
  timeline: TimelineEvent[];
  documents: Document[];
  created_at: string;
  updated_at: string;
}

export interface CreateAppointmentPayload {
  appointment_type: AppointmentType;
  appointment_datetime: string;
  venue: string;
  duration_minutes: number;
  claimant_id: string;
  attorney_id: string;
  created_by: string;
}

export interface StatusTransitionContext {
  currentStatus: AppointmentStatus;
  nextStatus: AppointmentStatus;
  actorId: string;
  actorRole: string;
  reason?: string;
}

export const VALID_STATUS_TRANSITIONS: Record<AppointmentStatus, AppointmentStatus[]> = {
  DRAFT: ['PENDING_APPROVAL', 'CANCELLED'],
  PENDING_APPROVAL: ['APPROVED', 'REJECTED'],
  APPROVED: ['SCHEDULED', 'CANCELLED'],
  REJECTED: ['DRAFT'],
  SCHEDULED: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['IN_PROGRESS', 'CANCELLED'],
  IN_PROGRESS: ['ASSESSMENT_PENDING', 'CANCELLED'],
  ASSESSMENT_PENDING: ['ASSESSMENT_COMPLETE'],
  ASSESSMENT_COMPLETE: ['REPORT_PENDING'],
  REPORT_PENDING: ['REPORT_SUBMITTED'],
  REPORT_SUBMITTED: ['REPORT_REVIEWED'],
  REPORT_REVIEWED: ['INVOICE_PENDING'],
  INVOICE_PENDING: ['INVOICE_SENT'],
  INVOICE_SENT: ['PAID', 'OVERDUE'],
  PAID: ['ARCHIVED'],
  OVERDUE: ['PAID', 'ESCALATED'],
  ESCALATED: ['PAID', 'CANCELLED'],
  ARCHIVED: [],
  CANCELLED: [],
};

export const STATUS_REQUIRES_REASON = ['REJECTED', 'CANCELLED'];

export interface AppointmentQueryOptions {
  limit?: number;
  offset?: number;
  status?: AppointmentStatus;
  appointment_type?: AppointmentType;
  date_from?: string;
  date_to?: string;
  attorney_id?: string;
  expert_id?: string;
}
