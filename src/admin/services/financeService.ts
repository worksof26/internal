/**
 * Finance Service
 * Thin Supabase wrapper layer for finance operations
 * Calls financeEngine methods and handles database connectivity
 */

import { createClient } from '@supabase/supabase-js';
import FinanceEngine from '../engines/financeEngine';
import { Invoice, InvoiceStatus } from '../types/finance.types';
import { logger } from '../utils/logger';

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface GenerateInvoicePayload {
  appointmentId: string;
  feeSchedule: {
    expertId: string;
    appointmentType: string;
    amountCents: number;
  };
  generatedBy: string;
}

interface RecordPaymentPayload {
  invoiceId: string;
  amount_cents: number;
  payment_method: string;
  reference: string;
  recordedBy: string;
}

export class FinanceService {
  /**
   * Generate invoice for appointment
   * @param payload - Invoice generation details
   * @returns Promise<Invoice>
   */
  static async generateInvoice(payload: GenerateInvoicePayload): Promise<Invoice> {
    try {
      const invoice = await FinanceEngine.generateInvoice(payload.appointmentId, payload.feeSchedule);

      // TODO: Insert into Supabase 'invoices' table
      // const vatCents = Math.round(payload.feeSchedule.amountCents * 0.15); // 15% VAT
      // const { data, error } = await supabase
      //   .from('invoices')
      //   .insert([{
      //     appointment_id: payload.appointmentId,
      //     amount_cents: payload.feeSchedule.amountCents,
      //     vat_cents: vatCents,
      //     total_cents: payload.feeSchedule.amountCents + vatCents,
      //     status: 'DRAFT',
      //     generated_by: payload.generatedBy,
      //   }])
      //   .select()
      //   .single();

      logger.info('Invoice generated via service', {
        appointment_id: payload.appointmentId,
        amount_cents: payload.feeSchedule.amountCents,
      });

      return invoice;
    } catch (error) {
      logger.error('Finance service: Failed to generate invoice', error as Error);
      throw error;
    }
  }

  /**
   * Record payment for invoice
   * @param payload - Payment details
   * @returns Promise<any>
   */
  static async recordPayment(payload: RecordPaymentPayload): Promise<any> {
    try {
      const result = await FinanceEngine.recordPayment(payload.invoiceId, {
        amount_cents: payload.amount_cents,
        payment_method: payload.payment_method,
        reference: payload.reference,
      });

      // TODO: Insert into Supabase 'payments' table
      // const { data: paymentData, error: paymentError } = await supabase
      //   .from('payments')
      //   .insert([{
      //     invoice_id: payload.invoiceId,
      //     amount_cents: payload.amount_cents,
      //     payment_method: payload.payment_method,
      //     reference: payload.reference,
      //     recorded_by: payload.recordedBy,
      //   }])
      //   .select()
      //   .single();

      // TODO: Update invoice status to PAID
      // const { data: invoiceData, error: invoiceError } = await supabase
      //   .from('invoices')
      //   .update({ status: 'PAID', paid_at: new Date().toISOString() })
      //   .eq('id', payload.invoiceId)
      //   .select()
      //   .single();

      logger.info('Payment recorded via service', {
        invoice_id: payload.invoiceId,
        amount_cents: payload.amount_cents,
      });

      return result;
    } catch (error) {
      logger.error('Finance service: Failed to record payment', error as Error);
      throw error;
    }
  }

  /**
   * Calculate VAT (default 15% South African VAT)
   * @param amount - Amount in cents
   * @returns number - VAT amount in cents
   */
  static async calculateVAT(amount: number): Promise<number> {
    return FinanceEngine.calculateVAT(amount);
  }

  /**
   * Mark invoice as overdue
   * @param invoiceId - Invoice ID
   * @returns Promise<any>
   */
  static async markOverdue(invoiceId: string): Promise<any> {
    try {
      const result = await FinanceEngine.markOverdue(invoiceId);

      // TODO: Update invoice status to OVERDUE
      // const { data, error } = await supabase
      //   .from('invoices')
      //   .update({ status: 'OVERDUE', updated_at: new Date().toISOString() })
      //   .eq('id', invoiceId)
      //   .select()
      //   .single();

      logger.info('Invoice marked overdue via service', {
        invoice_id: invoiceId,
      });

      return result;
    } catch (error) {
      logger.error('Finance service: Failed to mark overdue', error as Error);
      throw error;
    }
  }

  /**
   * Escalate debt
   * @param invoiceId - Invoice ID
   * @returns Promise<any>
   */
  static async escalateDebt(invoiceId: string): Promise<any> {
    try {
      const result = await FinanceEngine.escalateDebt(invoiceId);

      // TODO: Update invoice status to ESCALATED
      // const { data, error } = await supabase
      //   .from('invoices')
      //   .update({ status: 'ESCALATED', updated_at: new Date().toISOString() })
      //   .eq('id', invoiceId)
      //   .select()
      //   .single();

      logger.info('Debt escalated via service', {
        invoice_id: invoiceId,
      });

      return result;
    } catch (error) {
      logger.error('Finance service: Failed to escalate debt', error as Error);
      throw error;
    }
  }

  /**
   * Generate financial summary for date range
   * @param dateFrom - Start date
   * @param dateTo - End date
   * @returns Promise<any>
   */
  static async generateFinancialSummary(dateFrom: string, dateTo: string): Promise<any> {
    try {
      // TODO: Aggregate query from Supabase 'invoices' and 'payments' tables
      // SUM(total_cents), COUNT by status, etc.

      const result = await FinanceEngine.generateFinancialSummary({
        date_from: dateFrom,
        date_to: dateTo,
      });

      logger.info('Financial summary generated via service', {
        date_range: { from: dateFrom, to: dateTo },
      });

      return result;
    } catch (error) {
      logger.error('Finance service: Failed to generate financial summary', error as Error);
      throw error;
    }
  }

  /**
   * Get outstanding invoices
   * @returns Promise<Invoice[]>
   */
  static async getOutstandingInvoices(): Promise<Invoice[]> {
    try {
      // TODO: Fetch from Supabase 'invoices' table where status in (SENT, OVERDUE, ESCALATED)
      // const { data, error } = await supabase
      //   .from('invoices')
      //   .select('*')
      //   .in('status', ['SENT', 'OVERDUE', 'ESCALATED'])
      //   .order('due_date', { ascending: true });

      const result = await FinanceEngine.getOutstandingInvoices();

      logger.info('Outstanding invoices retrieved via service', {
        count: result.length,
      });

      return result;
    } catch (error) {
      logger.error('Finance service: Failed to get outstanding invoices', error as Error);
      throw error;
    }
  }

  /**
   * Get fee schedule for expert and appointment type
   * @param expertId - Expert ID
   * @param appointmentType - Appointment type
   * @returns Promise<any>
   */
  static async getFeeSchedule(expertId: string, appointmentType: string): Promise<any> {
    try {
      // TODO: Fetch from Supabase 'expert_fee_schedules' table
      // const { data, error } = await supabase
      //   .from('expert_fee_schedules')
      //   .select('*')
      //   .eq('expert_id', expertId)
      //   .eq('appointment_type', appointmentType)
      //   .single();

      const result = await FinanceEngine.getFeeSchedule(expertId, appointmentType);

      logger.info('Fee schedule retrieved via service', {
        expert_id: expertId,
        appointment_type: appointmentType,
      });

      return result;
    } catch (error) {
      logger.error('Finance service: Failed to get fee schedule', error as Error);
      throw error;
    }
  }

  /**
   * Apply discount to invoice
   * @param invoiceId - Invoice ID
   * @param discountPercent - Discount percentage
   * @param authorisedBy - User ID
   * @returns Promise<any>
   */
  static async applyDiscount(invoiceId: string, discountPercent: number, authorisedBy: string): Promise<any> {
    try {
      const result = await FinanceEngine.applyDiscount(invoiceId, discountPercent, authorisedBy);

      // TODO: Update invoice and log to finance_audit_log
      // const discountAmount = Math.round(invoice.total_cents * (discountPercent / 100));
      // await supabase
      //   .from('invoices')
      //   .update({ 
      //     total_cents: invoice.total_cents - discountAmount,
      //     updated_at: new Date().toISOString()
      //   })
      //   .eq('id', invoiceId);

      logger.info('Discount applied via service', {
        invoice_id: invoiceId,
        discount_percent: discountPercent,
      });

      return result;
    } catch (error) {
      logger.error('Finance service: Failed to apply discount', error as Error);
      throw error;
    }
  }

  /**
   * Void invoice
   * @param invoiceId - Invoice ID
   * @param reason - Void reason
   * @param authorisedBy - User ID
   * @returns Promise<any>
   */
  static async voidInvoice(invoiceId: string, reason: string, authorisedBy: string): Promise<any> {
    try {
      const result = await FinanceEngine.voidInvoice(invoiceId, reason, authorisedBy);

      // TODO: Update invoice status to VOIDED
      // const { data, error } = await supabase
      //   .from('invoices')
      //   .update({ status: 'VOIDED', updated_at: new Date().toISOString() })
      //   .eq('id', invoiceId);

      logger.info('Invoice voided via service', {
        invoice_id: invoiceId,
      });

      return result;
    } catch (error) {
      logger.error('Finance service: Failed to void invoice', error as Error);
      throw error;
    }
  }
}

export default FinanceService;