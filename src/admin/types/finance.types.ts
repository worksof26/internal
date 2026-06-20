/**
 * Finance Types
 * Invoice, payment, and financial transaction structures
 * Note: All monetary values in cents (integer). Display layer divides by 100 for ZAR display.
 */

export type InvoiceStatus = 'DRAFT' | 'SENT' | 'PAID' | 'OVERDUE' | 'ESCALATED' | 'VOIDED';

export type PaymentMethod = 'EFT' | 'CREDIT_CARD' | 'BANK_TRANSFER' | 'CHEQUE' | 'OTHER';

export interface Invoice {
  id: string;
  invoice_number: string;
  appointment_id: string;
  amount_cents: number; // Base amount
  vat_cents: number; // 15% VAT
  total_cents: number; // amount + vat
  status: InvoiceStatus;
  due_date: string; // ISO 8601 date
  issued_date: string;
  paid_at: string | null;
  payment_method: PaymentMethod | null;
  payment_reference: string | null;
  receipt_url: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: string;
  invoice_id: string;
  amount_cents: number;
  payment_method: PaymentMethod;
  reference: string;
  paid_at: string;
  recorded_by: string;
  notes: string | null;
  created_at: string;
}

export interface FinanceAuditLogEntry {
  id: string;
  invoice_id: string;
  action_type: 'GENERATED' | 'SENT' | 'PAYMENT_RECORDED' | 'VOIDED' | 'DISCOUNT_APPLIED';
  actor_id: string;
  actor_name: string;
  before_state?: Record<string, unknown>;
  after_state?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
  created_at: string;
}

export interface ExpertFeeSchedule {
  id: string;
  expert_id: string;
  appointment_type: string;
  amount_cents: number; // Per appointment
  vat_cents: number;
  created_at: string;
  updated_at: string;
}

export interface FinanceSummary {
  total_invoiced_cents: number; // All time
  total_collected_cents: number;
  outstanding_cents: number;
  overdue_cents: number;
  overdue_count: number;
  monthly_revenue: MonthlyRevenue[];
  monthly_target_cents: number;
}

export interface MonthlyRevenue {
  month: string; // YYYY-MM
  invoiced_cents: number;
  collected_cents: number;
}

export interface DiscountRequest {
  invoice_id: string;
  discount_percent: number; // 0-100
  reason: string;
  authorised_by: string;
}

export interface InvoiceVoidRequest {
  invoice_id: string;
  reason: string;
  authorised_by: string;
}

export const VAT_RATE = 0.15; // 15% South African VAT
export const CURRENCY = 'ZAR';

export const calculateVAT = (amountCents: number): number => {
  return Math.round(amountCents * VAT_RATE);
};

export const calculateTotal = (amountCents: number): number => {
  const vat = calculateVAT(amountCents);
  return amountCents + vat;
};

export const centsToCurrency = (cents: number): string => {
  return (cents / 100).toLocaleString('en-ZA', {
    style: 'currency',
    currency: CURRENCY,
  });
};
