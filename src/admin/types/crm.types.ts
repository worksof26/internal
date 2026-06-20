/**
 * CRM Types
 * Attorney, Expert, and Claimant structures
 */

export interface Attorney {
  id: string;
  firm_name: string;
  attorney_name: string;
  email: string;
  phone: string;
  address: string;
  practice_number: string;
  fax?: string;
  website?: string;
  contact_person?: string;
  portal_status: 'ACTIVE' | 'INACTIVE' | 'PENDING_OTP';
  total_appointments: number;
  active_appointments: number;
  outstanding_invoices_cents: number;
  created_at: string;
  updated_at: string;
}

export interface Expert {
  id: string;
  full_name: string;
  specialisation: string;
  practice_number: string;
  hpcsa_number: string;
  email: string;
  phone: string;
  address: string;
  regions: string[]; // Provinces/areas of operation
  qualifications: string[];
  portal_status: 'ACTIVE' | 'INACTIVE' | 'PENDING_OTP';
  availability_status: 'AVAILABLE' | 'BUSY' | 'ON_LEAVE';
  total_assessments: number;
  on_time_delivery_percent: number;
  average_turnaround_days: number;
  created_at: string;
  updated_at: string;
}

export interface ExpertAvailability {
  expert_id: string;
  date: string; // ISO 8601 date
  status: 'AVAILABLE' | 'BUSY' | 'ON_LEAVE';
  notes?: string;
  updated_at: string;
}

export interface Claimant {
  id: string;
  full_name: string;
  id_number: string;
  date_of_birth: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  email?: string;
  phone?: string;
  address: string;
  city: string;
  province: string;
  postal_code: string;
  injury_description: string;
  date_of_injury: string;
  linked_attorney_id: string;
  legal_matter_reference: string;
  portal_access: boolean;
  total_appointments: number;
  created_at: string;
  updated_at: string;
}

export interface ExpertFeeSchedule {
  id: string;
  expert_id: string;
  appointment_type: string;
  amount_cents: number;
  vat_cents: number;
  effective_date: string;
  end_date?: string;
  created_at: string;
  updated_at: string;
}

export interface AttorneyStats {
  attorney_id: string;
  total_appointments: number;
  appointments_this_month: number;
  appointments_this_year: number;
  active_appointments: number;
  completed_appointments: number;
  outstanding_invoices_count: number;
  outstanding_invoices_cents: number;
  total_invoiced_cents: number;
  total_collected_cents: number;
}

export interface ExpertStats {
  expert_id: string;
  total_completed_assessments: number;
  reports_submitted_on_time: number;
  reports_late: number;
  average_turnaround_days: number;
  appointments_this_month: number;
  total_earnings_cents: number;
  rating?: number; // 1-5 stars
}

export interface ClaimantAppointmentHistory {
  claimant_id: string;
  appointments: {
    id: string;
    reference_number: string;
    appointment_type: string;
    appointment_date: string;
    expert_name: string;
    status: string;
    attorney_name: string;
  }[];
}

export interface CRMFilterOptions {
  search_term?: string;
  status?: 'ACTIVE' | 'INACTIVE';
  date_from?: string;
  date_to?: string;
  sort_by?: 'NAME' | 'DATE_CREATED' | 'APPOINTMENTS';
  sort_order?: 'ASC' | 'DESC';
}
