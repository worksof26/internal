/**
 * Finance Engine
 * Handles all financial logic: invoice generation, payment recording, VAT calculations, overdue tracking
 * All monetary values stored as integers (cents). Display layer converts to ZAR.
 * Depends on: auditEngine (for logging)
 * Pure TypeScript — no React, no JSX.
 */

import {
  Invoice,
  InvoiceStatus,
  Payment,
  PaymentMethod,
  FinanceAuditLogEntry,
  ExpertFeeSchedule,
  FinanceSummary,
  MonthlyRevenue,
  VAT_RATE,
  calculateVAT,
  calculateTotal,
} from '../types/finance.types';
import { logger } from '../utils/logger';
import AuditEngine from './auditEngine';

interface GenerateInvoicePayload {
  appointment_id: string;
  amount_cents: number;
  expert_id?: string;
  due_date: string;
  created_by: string;
}

interface RecordPaymentPayload {
  invoice_id: string;
  amount_cents: number;
  payment_method: PaymentMethod;
  reference: string;
  recorded_by: string;
  notes?: string;
}

interface MarkOverduePayload {
  invoice_id: string;
  marked_by: string;
}

export class FinanceEngine {
  /**
   * Generate an invoice for an appointment
   * Calculates VAT at 15%, creates invoice record
   * @param payload - Invoice generation details
   * @returns Promise<Invoice> - Created invoice
   */
  static async generateInvoice(payload: GenerateInvoicePayload): Promise<Invoice> {
    try {
      const { appointment_id, amount_cents, expert_id, due_date, created_by } = payload;

      // Validate inputs
      if (!appointment_id || amount_cents <= 0 || !due_date) {
        throw new Error('Invalid invoice generation parameters');
      }

      // Calculate VAT and total
      const vat_cents = calculateVAT(amount_cents);
      const total_cents = calculateTotal(amount_cents);
      const invoice_number = this.generateInvoiceNumber();

      // TODO: Replace with actual Supabase insert
      // const { data, error } = await supabase
      //   .from('invoices')
      //   .insert([{
      //     invoice_number,
      //     appointment_id,
      //     amount_cents,
      //     vat_cents,
      //     total_cents,
      //     status: 'DRAFT',
      //     due_date,
      //     issued_date: new Date().toISOString(),
      //   }])
      //   .select()
      //   .single();

      const invoice: Invoice = {
        id: `inv_${Date.now()}`,
        invoice_number,
        appointment_id,
        amount_cents,
        vat_cents,
        total_cents,
        status: 'DRAFT',
        due_date,
        issued_date: new Date().toISOString(),
        paid_at: null,
        payment_method: null,
        payment_reference: null,
        receipt_url: null,
        notes: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // Log to audit trail
      await AuditEngine.logAction({
        actor_id: created_by,
        actor_name: 'Finance Staff',
        actor_role: 'finance',
        action_type: 'FIN_INVOICE_GENERATED',
        entity_type: 'INVOICE',
        entity_id: invoice.id,
        after_state: invoice,
        metadata: {
          amount_zar: (amount_cents / 100).toFixed(2),
          vat_zar: (vat_cents / 100).toFixed(2),
          total_zar: (total_cents / 100).toFixed(2),
        },
      });

      logger.info('Invoice generated', {
        invoice_number,
        appointment_id,
        total_zar: (total_cents / 100).toFixed(2),
      });

      return invoice;
    } catch (error) {
      logger.error('Failed to generate invoice', error as Error, {
        appointment_id: payload.appointment_id,
      });
      throw error;
    }
  }

  /**
   * Record a payment against an invoice
   * Updates invoice status to PAID when full amount received
   * @param payload - Payment details
   * @returns Promise<Payment> - Payment record
   */
  static async recordPayment(payload: RecordPaymentPayload): Promise<Payment> {
    try {
      const { invoice_id, amount_cents, payment_method, reference, recorded_by, notes } = payload;

      // Validate inputs
      if (!invoice_id || amount_cents <= 0 || !payment_method) {
        throw new Error('Invalid payment parameters');
      }

      // TODO: Replace with actual Supabase transaction
      // 1. Get invoice
      // 2. Create payment record
      // 3. Update invoice status
      // 4. Log to audit trail

      const payment: Payment = {
        id: `pay_${Date.now()}`,
        invoice_id,
        amount_cents,
        payment_method,
        reference,
        paid_at: new Date().toISOString(),
        recorded_by,
        notes: notes || null,
        created_at: new Date().toISOString(),
      };

      // Log to audit trail
      await AuditEngine.logAction({
        actor_id: recorded_by,
        actor_name: 'Finance Staff',
        actor_role: 'finance',
        action_type: 'FIN_PAYMENT_RECORDED',
        entity_type: 'INVOICE',
        entity_id: invoice_id,
        after_state: payment,
        metadata: {
          amount_zar: (amount_cents / 100).toFixed(2),
          payment_method,
        },
      });

      logger.info('Payment recorded', {
        invoice_id,
        amount_zar: (amount_cents / 100).toFixed(2),
        payment_method,
      });

      return payment;
    } catch (error) {
      logger.error('Failed to record payment', error as Error, {
        invoice_id: payload.invoice_id,
      });
      throw error;
    }
  }

  /**
   * Mark an invoice as overdue
   * Typically called by workflow when due date passes without payment
   * @param payload - Overdue marking details
   * @returns Promise<Invoice> - Updated invoice
   */
  static async markOverdue(payload: MarkOverduePayload): Promise<Invoice> {
    try {
      const { invoice_id, marked_by } = payload;

      // TODO: Replace with actual Supabase update
      // const { data, error } = await supabase
      //   .from('invoices')
      //   .update({ status: 'OVERDUE' })
      //   .eq('id', invoice_id)
      //   .select()
      //   .single();

      const invoice: Invoice = {
        id: invoice_id,
        invoice_number: '',
        appointment_id: '',
        amount_cents: 0,
        vat_cents: 0,
        total_cents: 0,
        status: 'OVERDUE',
        due_date: '',
        issued_date: '',
        paid_at: null,
        payment_method: null,
        payment_reference: null,
        receipt_url: null,
        notes: null,
        created_at: '',
        updated_at: new Date().toISOString(),
      };

      // Log to audit trail
      await AuditEngine.logAction({
        actor_id: marked_by,
        actor_name: 'System',
        actor_role: 'system',
        action_type: 'FIN_INVOICE_GENERATED', // TODO: Create OVERDUE action
        entity_type: 'INVOICE',
        entity_id: invoice_id,
        after_state: { status: 'OVERDUE' },
      });

      logger.info('Invoice marked as overdue', { invoice_id });

      return invoice;
    } catch (error) {
      logger.error('Failed to mark invoice as overdue', error as Error, { invoice_id: payload.invoice_id });
      throw error;
    }
  }

  /**
   * Escalate a debt (from OVERDUE to ESCALATED)
   * Typically after sending final notice without payment
   * @param invoice_id - Invoice ID
   * @param escalated_by - User ID
   * @returns Promise<Invoice> - Updated invoice
   */
  static async escalateDebt(invoice_id: string, escalated_by: string): Promise<Invoice> {
    try {
      // TODO: Replace with actual Supabase update
      // const { data, error } = await supabase
      //   .from('invoices')
      //   .update({ status: 'ESCALATED' })
      //   .eq('id', invoice_id)
      //   .select()
      //   .single();

      // Log to audit trail
      await AuditEngine.logAction({
        actor_id: escalated_by,
        actor_name: 'Finance Manager',
        actor_role: 'finance',
        action_type: 'FIN_OVERDUE_ESCALATED', // Using similar action
        entity_type: 'INVOICE',
        entity_id: invoice_id,
        after_state: { status: 'ESCALATED' },
      });

      logger.info('Debt escalated', { invoice_id, escalated_by });

      return {
        id: invoice_id,
        invoice_number: '',
        appointment_id: '',
        amount_cents: 0,
        vat_cents: 0,
        total_cents: 0,
        status: 'ESCALATED',
        due_date: '',
        issued_date: '',
        paid_at: null,
        payment_method: null,
        payment_reference: null,
        receipt_url: null,
        notes: null,
        created_at: '',
        updated_at: new Date().toISOString(),
      };
    } catch (error) {
      logger.error('Failed to escalate debt', error as Error, { invoice_id });
      throw error;
    }
  }

  /**
   * Get financial summary for dashboard
   * @param dateFrom - Start date (ISO 8601)
   * @param dateTo - End date (ISO 8601)
   * @returns Promise<FinanceSummary> - Summary statistics
   */
  static async getFinancialSummary(dateFrom: string, dateTo: string): Promise<FinanceSummary> {
    try {
      // TODO: Replace with actual Supabase aggregation queries
      // 1. Sum all invoiced amounts
      // 2. Sum all paid amounts
      // 3. Sum overdue amounts
      // 4. Get monthly breakdown

      logger.info('Financial summary retrieved', { date_range: { from: dateFrom, to: dateTo } });

      return {
        total_invoiced_cents: 0,
        total_collected_cents: 0,
        outstanding_cents: 0,
        overdue_cents: 0,
        overdue_count: 0,
        monthly_revenue: [],
        monthly_target_cents: 0,
      };
    } catch (error) {
      logger.error('Failed to get financial summary', error as Error);
      throw error;
    }
  }

  /**
   * Get all outstanding (unpaid) invoices
   * @returns Promise<Invoice[]> - Outstanding invoices
   */
  static async getOutstandingInvoices(): Promise<Invoice[]> {
    try {
      // TODO: Replace with actual Supabase query
      // const { data, error } = await supabase
      //   .from('invoices')
      //   .select('*')
      //   .in('status', ['SENT', 'OVERDUE', 'ESCALATED'])
      //   .order('due_date', { ascending: true });

      logger.info('Outstanding invoices retrieved');

      return [];
    } catch (error) {
      logger.error('Failed to get outstanding invoices', error as Error);
      throw error;
    }
  }

  /**
   * Get fee schedule for an expert and appointment type
   * @param expert_id - Expert ID
   * @param appointment_type - Appointment type
   * @returns Promise<number> - Fee in cents
   */
  static async getFeeSchedule(expert_id: string, appointment_type: string): Promise<number> {
    try {
      // TODO: Replace with actual Supabase query
      // const { data, error } = await supabase
      //   .from('expert_fee_schedules')
      //   .select('amount_cents')
      //   .eq('expert_id', expert_id)
      //   .eq('appointment_type', appointment_type)
      //   .single();

      logger.info('Fee schedule retrieved', { expert_id, appointment_type });

      return 0;
    } catch (error) {
      logger.error('Failed to get fee schedule', error as Error, {
        expert_id,
        appointment_type,
      });
      throw error;
    }
  }

  /**
   * Apply a discount to an invoice
   * Requires authorization and logs action
   * @param invoice_id - Invoice ID
   * @param discount_percent - Discount percentage (0-100)
   * @param authorized_by - User ID approving discount
   * @returns Promise<Invoice> - Updated invoice
   */
  static async applyDiscount(invoice_id: string, discount_percent: number, authorized_by: string): Promise<Invoice> {
    try {
      // Validate discount
      if (discount_percent < 0 || discount_percent > 100) {
        throw new Error('Discount must be between 0 and 100 percent');
      }

      // TODO: Replace with actual Supabase transaction
      // 1. Get invoice
      // 2. Calculate new total with discount
      // 3. Update invoice
      // 4. Create finance audit log entry

      // Log to audit trail
      await AuditEngine.logAction({
        actor_id: authorized_by,
        actor_name: 'Finance Manager',
        actor_role: 'finance',
        action_type: 'FIN_DISCOUNT_APPLIED',
        entity_type: 'INVOICE',
        entity_id: invoice_id,
        metadata: { discount_percent },
      });

      logger.info('Discount applied to invoice', {
        invoice_id,
        discount_percent,
        authorized_by,
      });

      return {
        id: invoice_id,
        invoice_number: '',
        appointment_id: '',
        amount_cents: 0,
        vat_cents: 0,
        total_cents: 0,
        status: 'DRAFT',
        due_date: '',
        issued_date: '',
        paid_at: null,
        payment_method: null,
        payment_reference: null,
        receipt_url: null,
        notes: null,
        created_at: '',
        updated_at: new Date().toISOString(),
      };
    } catch (error) {
      logger.error('Failed to apply discount', error as Error, { invoice_id, authorized_by });
      throw error;
    }
  }

  /**
   * Void an invoice (cannot be reversed)
   * Requires reason and authorization
   * @param invoice_id - Invoice ID
   * @param reason - Reason for voiding
   * @param authorized_by - User ID
   * @returns Promise<Invoice> - Voided invoice
   */
  static async voidInvoice(invoice_id: string, reason: string, authorized_by: string): Promise<Invoice> {
    try {
      if (!reason || reason.trim().length === 0) {
        throw new Error('Reason is required to void an invoice');
      }

      // TODO: Replace with actual Supabase update
      // const { data, error } = await supabase
      //   .from('invoices')
      //   .update({ status: 'VOIDED', notes: reason })
      //   .eq('id', invoice_id)
      //   .select()
      //   .single();

      // Log to audit trail
      await AuditEngine.logAction({
        actor_id: authorized_by,
        actor_name: 'Finance Manager',
        actor_role: 'finance',
        action_type: 'FIN_INVOICE_VOIDED',
        entity_type: 'INVOICE',
        entity_id: invoice_id,
        metadata: { reason },
      });

      logger.info('Invoice voided', { invoice_id, reason, authorized_by });

      return {
        id: invoice_id,
        invoice_number: '',
        appointment_id: '',
        amount_cents: 0,
        vat_cents: 0,
        total_cents: 0,
        status: 'VOIDED',
        due_date: '',
        issued_date: '',
        paid_at: null,
        payment_method: null,
        payment_reference: null,
        receipt_url: null,
        notes: reason,
        created_at: '',
        updated_at: new Date().toISOString(),
      };
    } catch (error) {
      logger.error('Failed to void invoice', error as Error, { invoice_id, authorized_by });
      throw error;
    }
  }

  /**
   * Generate a unique invoice number
   * Format: INV-YYYY-NNNN (e.g., INV-2026-0042)
   * @returns string - Invoice number
   */
  private static generateInvoiceNumber(): string {
    const year = new Date().getFullYear();
    const sequence = Math.floor(Math.random() * 10000);
    return `INV-${year}-${String(sequence).padStart(4, '0')}`;
  }
}

export default FinanceEngine;
