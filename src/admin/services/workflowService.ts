/**
 * Workflow Service
 * Thin Supabase wrapper layer for workflow orchestration operations
 * Calls workflowEngine methods and handles database connectivity
 */

import { createClient } from '@supabase/supabase-js';
import WorkflowEngine from '../engines/workflowEngine';
import { logger } from '../utils/logger';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export class WorkflowService {
  /**
   * Run daily workflow (called by cron Edge Function)
   * Executes all scheduled automated tasks
   * @returns Promise
   */
  static async runDailyWorkflow(): Promise<any> {
    try {
      const result = await WorkflowEngine.runDailyWorkflow();

      logger.info('Daily workflow executed via service');

      return result;
    } catch (error) {
      logger.error('Workflow service: Failed to run daily workflow', error as Error);
      throw error;
    }
  }

  /**
   * Check for overdue invoices and trigger escalation workflow
   * @returns Promise
   */
  static async checkOverdueInvoices(): Promise<any> {
    try {
      // TODO: Query Supabase for invoices with due_date < today
      // const { data, error } = await supabase
      //   .from('invoices')
      //   .select('*')
      //   .eq('status', 'SENT')
      //   .lt('due_date', new Date().toISOString().split('T')[0]);

      const result = await WorkflowEngine.checkOverdueInvoices();

      logger.info('Overdue invoices checked via service');

      return result;
    } catch (error) {
      logger.error('Workflow service: Failed to check overdue invoices', error as Error);
      throw error;
    }
  }

  /**
   * Check for pending assessments and auto-transition if deadline passed
   * @returns Promise
   */
  static async checkPendingAssessments(): Promise<any> {
    try {
      // TODO: Query Supabase for appointments in ASSESSMENT_PENDING status
      // Check if deadline has passed (appointment_datetime + assessment_deadline_days)

      const result = await WorkflowEngine.checkPendingAssessments();

      logger.info('Pending assessments checked via service');

      return result;
    } catch (error) {
      logger.error('Workflow service: Failed to check pending assessments', error as Error);
      throw error;
    }
  }

  /**
   * Check for pending reports and auto-transition if deadline passed
   * @returns Promise
   */
  static async checkPendingReports(): Promise<any> {
    try {
      // TODO: Query Supabase for appointments in REPORT_PENDING status
      // Check if deadline has passed (assessment_complete_date + report_deadline_days)

      const result = await WorkflowEngine.checkPendingReports();

      logger.info('Pending reports checked via service');

      return result;
    } catch (error) {
      logger.error('Workflow service: Failed to check pending reports', error as Error);
      throw error;
    }
  }

  /**
   * Auto-archive completed appointments after 90 days
   * @returns Promise
   */
  static async autoArchiveCompleted(): Promise<any> {
    try {
      // TODO: Query Supabase for appointments with status=PAID and updated_at < 90 days ago
      // Transition to ARCHIVED

      const result = await WorkflowEngine.autoArchiveCompleted();

      logger.info('Auto-archive completed via service');

      return result;
    } catch (error) {
      logger.error('Workflow service: Failed to auto-archive completed', error as Error);
      throw error;
    }
  }

  /**
   * Send scheduled reminders (24h and 1h before appointment)
   * @returns Promise
   */
  static async sendScheduledReminders(): Promise<any> {
    try {
      // TODO: Query Supabase for appointments with appointment_datetime between now and 24h away
      // Also query for appointments between now and 1h away
      // Send appropriate reminder notifications

      const result = await WorkflowEngine.sendScheduledReminders();

      logger.info('Scheduled reminders sent via service');

      return result;
    } catch (error) {
      logger.error('Workflow service: Failed to send scheduled reminders', error as Error);
      throw error;
    }
  }
}

export default WorkflowService;