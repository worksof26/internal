/**
 * Report Types
 * Medico-legal report lifecycle and versioning
 */

export type ReportStatus = 'PENDING' | 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'REVISION_REQUESTED' | 'DELIVERED';

export interface Report {
  id: string;
  appointment_id: string;
  expert_id: string;
  status: ReportStatus;
  submitted_at: string | null;
  reviewed_at: string | null;
  approved_at: string | null;
  delivered_at: string | null;
  download_url: string | null;
  storage_path: string | null;
  version_number: number;
  created_at: string;
  updated_at: string;
}

export interface ReportVersion {
  id: string;
  report_id: string;
  version_number: number;
  submitted_at: string;
  file_url: string;
  file_size: number;
  status: ReportStatus;
  created_at: string;
}

export interface ReportReview {
  id: string;
  report_id: string;
  reviewer_id: string;
  reviewer_name: string;
  review_notes: string;
  status: 'APPROVED' | 'REVISION_REQUESTED';
  created_at: string;
}

export interface ReportRevisionRequest {
  id: string;
  report_id: string;
  requested_by: string;
  revision_notes: string;
  requested_at: string;
}

export interface ReportDelivery {
  id: string;
  report_id: string;
  delivered_to: string; // Attorney email
  delivered_at: string;
  delivery_method: 'EMAIL' | 'PORTAL' | 'SECURE_LINK';
  read_at: string | null;
}

export interface ReportsSummary {
  total_submitted: number;
  total_approved: number;
  pending_review: number;
  revision_requested: number;
  delivered: number;
  average_turnaround_days: number;
  monthly_stats: MonthlyReportStats[];
}

export interface MonthlyReportStats {
  month: string; // YYYY-MM
  submitted: number;
  approved: number;
  revision_requested: number;
}

export interface ReportSubmissionPayload {
  appointment_id: string;
  expert_id: string;
  file_blob: Blob;
  file_name: string;
}

export interface ReportFilterOptions {
  status?: ReportStatus;
  expert_id?: string;
  appointment_type?: string;
  date_from?: string;
  date_to?: string;
  attorney_id?: string;
}
