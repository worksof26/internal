/**
 * Communication Service
 * Thin Supabase wrapper layer for communication operations
 * Calls communicationEngine methods and handles database connectivity
 */

import { createClient } from '@supabase/supabase-js';
import CommunicationEngine from '../engines/communicationEngine';
import { CommunicationLog, EmailTemplate } from '../types/communication.types';
import { logger } from '../utils/logger';

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface SendEmailPayload {
  to: string;
  templateId: string;
  variables: Record<string, string>;
  appointmentId?: string;
}

interface SendSMSPayload {
  phoneNumber: string;
  message: string;
  appointmentId?: string;
}

export class CommunicationService {
  /**
   * Send email using template
   * @param payload - Email details
   * @returns Promise
   */
  static async sendEmail(payload: SendEmailPayload): Promise<any> {
    try {
      const result = await CommunicationEngine.sendEmail(
        payload.to,
        payload.templateId,
        payload.variables,
        payload.appointmentId
      );

      // TODO: Insert into Supabase 'communications_log' table
      // const { data, error } = await supabase
      //   .from('communications_log')
      //   .insert([{
      //     type: 'EMAIL',
      //     recipient: payload.to,
      //     template_id: payload.templateId,
      //     appointment_id: payload.appointmentId,
      //     status: 'SENT',
      //     sent_at: new Date().toISOString(),
      //   }])
      //   .select()
      //   .single();

      logger.info('Email sent via service', {
        to: payload.to,
        template_id: payload.templateId,
      });

      return result;
    } catch (error) {
      logger.error('Communication service: Failed to send email', error as Error);
      throw error;
    }
  }

  /**
   * Send OTP via Resend email service
   * @param email - Recipient email
   * @param purpose - OTP purpose (PASSWORD_RESET, ACCOUNT_CREATED, etc.)
   * @returns Promise
   */
  static async sendOTP(email: string, purpose: string): Promise<any> {
    try {
      const result = await CommunicationEngine.sendOTP(email, purpose);

      // TODO: Insert into Supabase 'communications_log' table
      // const { data, error } = await supabase
      //   .from('communications_log')
      //   .insert([{
      //     type: 'OTP',
      //     recipient: email,
      //     purpose,
      //     status: 'SENT',
      //     sent_at: new Date().toISOString(),
      //   }])
      //   .select()
      //   .single();

      logger.info('OTP sent via service', {
        email,
        purpose,
      });

      return result;
    } catch (error) {
      logger.error('Communication service: Failed to send OTP', error as Error);
      throw error;
    }
  }

  /**
   * Send SMS
   * @param payload - SMS details
   * @returns Promise
   */
  static async sendSMS(payload: SendSMSPayload): Promise<any> {
    try {
      const result = await CommunicationEngine.sendSMS(
        payload.phoneNumber,
        payload.message,
        payload.appointmentId
      );

      // TODO: Insert into Supabase 'communications_log' table
      // const { data, error } = await supabase
      //   .from('communications_log')
      //   .insert([{
      //     type: 'SMS',
      //     recipient: payload.phoneNumber,
      //     message: payload.message,
      //     appointment_id: payload.appointmentId,
      //     status: 'SENT',
      //     sent_at: new Date().toISOString(),
      //   }])
      //   .select()
      //   .single();

      logger.info('SMS sent via service', {
        phone_number: payload.phoneNumber,
      });

      return result;
    } catch (error) {
      logger.error('Communication service: Failed to send SMS', error as Error);
      throw error;
    }
  }

  /**
   * Log internal note on appointment
   * @param appointmentId - Appointment ID
   * @param authorId - User ID
   * @param note - Note content
   * @returns Promise
   */
  static async logInternalNote(appointmentId: string, authorId: string, note: string): Promise<any> {
    try {
      const result = await CommunicationEngine.logInternalNote(appointmentId, authorId, note);

      // TODO: Insert into Supabase 'internal_notes' table
      // const { data, error } = await supabase
      //   .from('internal_notes')
      //   .insert([{
      //     appointment_id: appointmentId,
      //     author_id: authorId,
      //     content: note,
      //     created_at: new Date().toISOString(),
      //   }])
      //   .select()
      //   .single();

      logger.info('Internal note logged via service', {
        appointment_id: appointmentId,
        author_id: authorId,
      });

      return result;
    } catch (error) {
      logger.error('Communication service: Failed to log internal note', error as Error);
      throw error;
    }
  }

  /**
   * Get communication log for appointment
   * @param appointmentId - Appointment ID
   * @returns Promise
   */
  static async getCommunicationLog(appointmentId: string): Promise<CommunicationLog[]> {
    try {
      // TODO: Fetch from Supabase 'communications_log' table
      // const { data, error } = await supabase
      //   .from('communications_log')
      //   .select('*')
      //   .eq('appointment_id', appointmentId)
      //   .order('created_at', { ascending: false });

      const result = await CommunicationEngine.getCommunicationLog(appointmentId);

      logger.info('Communication log retrieved via service', {
        appointment_id: appointmentId,
      });

      return result;
    } catch (error) {
      logger.error('Communication service: Failed to get communication log', error as Error);
      throw error;
    }
  }

  /**
   * Get all email templates
   * @returns Promise
   */
  static async getEmailTemplates(): Promise<EmailTemplate[]> {
    try {
      // TODO: Fetch from Supabase 'email_templates' table
      // const { data, error } = await supabase
      //   .from('email_templates')
      //   .select('*')
      //   .eq('is_active', true)
      //   .order('template_id');

      const result = await CommunicationEngine.getEmailTemplates();

      logger.info('Email templates retrieved via service');

      return result;
    } catch (error) {
      logger.error('Communication service: Failed to get email templates', error as Error);
      throw error;
    }
  }

  /**
   * Update email template (admin only)
   * @param id - Template ID
   * @param content - Template content
   * @returns Promise
   */
  static async updateEmailTemplate(id: string, content: string): Promise<EmailTemplate> {
    try {
      // TODO: Update Supabase 'email_templates' table
      // const { data, error } = await supabase
      //   .from('email_templates')
      //   .update({ content, updated_at: new Date().toISOString() })
      //   .eq('id', id)
      //   .select()
      //   .single();

      const result = await CommunicationEngine.updateEmailTemplate(id, content);

      logger.info('Email template updated via service', {
        template_id: id,
      });

      return result;
    } catch (error) {
      logger.error('Communication service: Failed to update email template', error as Error);
      throw error;
    }
  }
}

export default CommunicationService;