import type { ReactNode } from 'react';
import type { AppointmentStatus } from '../../types/appointment.types';

const STATUS_LABELS: Record<AppointmentStatus, string> = {
  DRAFT: 'Draft',
  PENDING_APPROVAL: 'Awaiting Approval',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
  SCHEDULED: 'Scheduled',
  CONFIRMED: 'Confirmed',
  IN_PROGRESS: 'In Progress',
  ASSESSMENT_PENDING: 'Assessment Pending',
  ASSESSMENT_COMPLETE: 'Assessment Complete',
  REPORT_PENDING: 'Report Pending',
  REPORT_SUBMITTED: 'Report Submitted',
  REPORT_REVIEWED: 'Report Reviewed',
  INVOICE_PENDING: 'Invoice Pending',
  INVOICE_SENT: 'Invoice Sent',
  PAID: 'Paid',
  OVERDUE: 'Overdue',
  ESCALATED: 'Escalated',
  ARCHIVED: 'Archived',
  CANCELLED: 'Cancelled',
};

export function AppointmentStatusBadge({ status }: { status: AppointmentStatus }): ReactNode {
  return <span className={`admin-status-badge admin-status-badge--${status.toLowerCase().replace(/_/g, '-')}`}>{STATUS_LABELS[status]}</span>;
}

export default AppointmentStatusBadge;
