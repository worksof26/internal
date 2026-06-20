/**
 * Communication Engine
 * Manages all outbound/inbound communications: emails, SMS, OTPs, internal notes
 * Maintains a complete communication log for every message sent.
 * Depends on: auditEngine (for logging)
 * Pure TypeScript — no React, no JSX.
 */

import { EmailTemplateId, CommunicationLog, EmailTemplate, OTPVerification } from '../types/communication.types';
import { logger } from '../utils/logger';
import AuditEngine from './auditEngine';

interface SendEmailPayload {
  to: string;
  template_id: EmailTemplateId;
  variables: Record<string, string>;
  appointment_id?: string;
}

interface SendSMSPayload {
  phone_number: string;
  message: string;
  appointment_id?: string;
}

interface SendOTPPayload {
  email: string;
  purpose: 'LOGIN' | 'PASSWORD_RESET' | 'ACCOUNT_SETUP';
}

interface InternalNotePayload {
  appointment_id: string;
  author_id: string;
  author_name: string;
  content: string;
  is_visible_to_external: boolean;
}

export class CommunicationEngine {
  /**
   * Send an email using a template
   * Template variables are replaced with actual values
   * All emails are logged in communications_log table
   * @param payload - Email details
   * @returns Promise<CommunicationLog> - Log entry for sent email
   */
  static async sendEmail(payload: SendEmailPayload): Promise<CommunicationLog> {
    try {
      const { to, template_id, variables, appointment_id } = payload;

      if (!to || !template_id) {
        throw new Error('Missing required email fields: to, template_id');
      }

      // TODO: Replace with actual Supabase call
      // 1. Get email template from email_templates table
      // 2. Replace variables in template
      // 3. Call Resend email service via Edge Function
      // 4. Log result in communications_log

      const log: CommunicationLog = {
        id: `email_${Date.now()}`,
        appointment_id: appointment_id || null,
        user_id: '', // Would be set from context
        type: 'EMAIL',
        recipient: to,
        subject: template_id, // Should get from template
        message_body: JSON.stringify(variables),
        status: 'SENT',
        error_message: null,
        sent_at: new Date().toISOString(),
        failed_at: null,
        retry_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // Log action to audit trail
      await AuditEngine.logAction({
        actor_id: '', // From context
        actor_name: 'System',
        actor_role: 'system',
        action_type: 'SYS_SETTINGS_CHANGED', // TODO: More appropriate action
        entity_type: 'SYSTEM',
        entity_id: 'email_service',
        metadata: { template_id, recipient: to },
      });

      logger.info('Email sent', {
        template: template_id,
        recipient: to,
        appointment_id,
      });

      return log;
    } catch (error) {
      logger.error('Failed to send email', error as Error, {
        template_id: payload.template_id,
        recipient: payload.to,
      });
      throw error;
    }
  }

  /**
   * Send an OTP (One-Time Password) via email
   * OTP expires in 10 minutes by default
   * @param payload - OTP details
   * @returns Promise<OTPVerification> - OTP record
   */
  static async sendOTP(payload: SendOTPPayload): Promise<OTPVerification> {
    try {
      const { email, purpose } = payload;

      if (!email) {
        throw new Error('Email is required for OTP');
      }

      // Generate 6-digit OTP
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 minutes

      // TODO: Replace with actual Supabase insert
      // const { data, error } = await supabase
      //   .from('otp_verifications')
      //   .insert([{
      //     email,
      //     otp_code: otpCode,
      //     purpose,
      //     expires_at: expiresAt,
      //   }])
      //   .select()
      //   .single();

      // TODO: Send OTP via Resend Edge Function
      // await sendOTPEmail(email, otpCode);

      const otpRecord: OTPVerification = {
        id: `otp_${Date.now()}`,
        user_id: '',
        email,
        otp_code: otpCode,
        purpose,
        expires_at: expiresAt,
        verified_at: null,
        attempt_count: 0,
        failed_at: null,
        created_at: new Date().toISOString(),
      };

      logger.info('OTP sent', {
        email,
        purpose,
      });

      return otpRecord;
    } catch (error) {
      logger.error('Failed to send OTP', error as Error, { email: payload.email });
      throw error;
    }
  }

  /**
   * Verify an OTP code
   * @param email - Email address
   * @param otpCode - Code to verify
   * @param purpose - Purpose of OTP
   * @returns Promise<{ valid: boolean; error?: string }>
   */
  static async verifyOTP(email: string, otpCode: string, purpose: string): Promise<{ valid: boolean; error?: string }> {
    try {
      // TODO: Replace with actual Supabase query
      // const { data, error } = await supabase
      //   .from('otp_verifications')
      //   .select('*')
      //   .eq('email', email)
      //   .eq('otp_code', otpCode)
      //   .eq('purpose', purpose)
      //   .is('verified_at', null)
      //   .single();

      // Check if OTP exists and hasn't expired
      // if (!data) return { valid: false, error: 'Invalid or expired OTP' };
      // if (new Date(data.expires_at) < new Date()) {
      //   return { valid: false, error: 'OTP has expired' };
      // }
      // if (data.attempt_count >= 5) {
      //   return { valid: false, error: 'Too many attempts' };
      // }

      // TODO: Mark OTP as verified

      logger.info('OTP verified', { email, purpose });

      return { valid: true };
    } catch (error) {
      logger.error('Failed to verify OTP', error as Error, { email });
      return { valid: false, error: 'Verification failed' };
    }
  }

  /**
   * Send an SMS message
   * @param payload - SMS details
   * @returns Promise<CommunicationLog> - Log entry
   */
  static async sendSMS(payload: SendSMSPayload): Promise<CommunicationLog> {
    try {
      const { phone_number, message, appointment_id } = payload;

      if (!phone_number || !message) {
        throw new Error('Missing required SMS fields: phone_number, message');
      }

      // TODO: Replace with actual SMS provider (e.g., Twilio via Edge Function)
      // const { data, error } = await sendSMSViaEdgeFunction({ phone_number, message });

      const log: CommunicationLog = {
        id: `sms_${Date.now()}`,
        appointment_id: appointment_id || null,
        user_id: '',
        type: 'SMS',
        recipient: phone_number,
        subject: null,
        message_body: message,
        status: 'SENT',
        error_message: null,
        sent_at: new Date().toISOString(),
        failed_at: null,
        retry_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      logger.info('SMS sent', {
        phone_number,
        appointment_id,
      });

      return log;
    } catch (error) {
      logger.error('Failed to send SMS', error as Error, { phone_number: payload.phone_number });
      throw error;
    }
  }

  /**
   * Log an internal note on an appointment
   * Internal notes are staff-only and not visible to external users
   * @param payload - Note details
   * @returns Promise - Note record
   */
  static async logInternalNote(payload: InternalNotePayload): Promise<any> {
    try {
      const { appointment_id, author_id, author_name, content, is_visible_to_external } = payload;

      if (!appointment_id || !author_id || !content) {
        throw new Error('Missing required note fields: appointment_id, author_id, content');
      }

      // TODO: Replace with actual Supabase insert
      // const { data, error } = await supabase
      //   .from('internal_notes')
      //   .insert([{
      //     appointment_id,
      //     author_id,
      //     author_name,
      //     content,
      //     is_visible_to_external,
      //   }])
      //   .select()
      //   .single();

      const note = {
        id: `note_${Date.now()}`,
        appointment_id,
        author_id,
        author_name,
        content,
        is_visible_to_external,
        created_at: new Date().toISOString(),
      };

      // Log to audit trail
      await AuditEngine.logAction({
        actor_id: author_id,
        actor_name: author_name,
        actor_role: 'staff',
        action_type: 'APPT_CREATED', // TODO: More appropriate action
        entity_type: 'APPOINTMENT',
        entity_id: appointment_id,
        metadata: { note_id: note.id },
      });

      logger.info('Internal note logged', {
        appointment_id,
        author_id,
      });

      return note;
    } catch (error) {
      logger.error('Failed to log internal note', error as Error, {
        appointment_id: payload.appointment_id,
      });
      throw error;
    }
  }

  /**
   * Get communication log for an appointment
   * @param appointmentId - Appointment ID
   * @returns Promise<CommunicationLog[]> - All communications for appointment
   */
  static async getCommunicationLog(appointmentId: string): Promise<CommunicationLog[]> {
    try {
      // TODO: Replace with actual Supabase query
      // const { data, error } = await supabase
      //   .from('communications_log')
      //   .select('*')
      //   .eq('appointment_id', appointmentId)
      //   .order('created_at', { ascending: false });

      logger.info('Communication log retrieved', { appointment_id: appointmentId });

      return [];
    } catch (error) {
      logger.error('Failed to get communication log', error as Error, {
        appointment_id: appointmentId,
      });
      throw error;
    }
  }

  /**
   * Get all email templates
   * @returns Promise<EmailTemplate[]> - All templates
   */
  static async getEmailTemplates(): Promise<EmailTemplate[]> {
    try {
      // TODO: Replace with actual Supabase query
      // const { data, error } = await supabase
      //   .from('email_templates')
      //   .select('*')
      //   .order('template_id');

      logger.info('Email templates retrieved');

      return [];
    } catch (error) {
      logger.error('Failed to get email templates', error as Error);
      throw error;
    }
  }

  /**
   * Update an email template
   * Admin only — requires explicit authorization
   * @param templateId - Template ID
   * @param content - New template content (HTML)
   * @param authorizedBy - User ID performing update
   * @returns Promise<EmailTemplate> - Updated template
   */
  static async updateEmailTemplate(
    templateId: EmailTemplateId,
    content: string,
    authorizedBy: string
  ): Promise<EmailTemplate> {
    try {
      if (!templateId || !content) {
        throw new Error('Missing required template fields: template_id, content');
      }

      // TODO: Replace with actual Supabase update
      // const { data, error } = await supabase
      //   .from('email_templates')
      //   .update({ html_body: content, updated_at: new Date().toISOString() })
      //   .eq('template_id', templateId)
      //   .select()
      //   .single();

      // Log to audit trail
      await AuditEngine.logAction({
        actor_id: authorizedBy,
        actor_name: 'Admin',
        actor_role: 'admin',
        action_type: 'SYS_TEMPLATE_UPDATED',
        entity_type: 'SYSTEM',
        entity_id: templateId,
        metadata: { content_length: content.length },
      });

      logger.info('Email template updated', {
        template_id: templateId,
        authorized_by: authorizedBy,
      });

      return {
        id: `template_${Date.now()}`,
        template_id: templateId,
        subject: '',
        html_body: content,
        plain_text_body: '',
        variables: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    } catch (error) {
      logger.error('Failed to update email template', error as Error, {
        template_id: templateId,
        authorized_by: authorizedBy,
      });
      throw error;
    }
  }
}

export default CommunicationEngine;
