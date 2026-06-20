/**
 * Appointment Engine (MASTER ENGINE)
 * Core business logic for the entire appointment lifecycle.
 * This is the most critical engine — all workflows and processes revolve around it.
 * Depends on: auditEngine, financeEngine, reportEngine, communicationEngine, documentEngine
 * Pure TypeScript — no React, no JSX.
 */

import {
  AppointmentStatus,
  AppointmentType,
  AppointmentMasterRecord,
  CreateAppointmentPayload,
  StatusTransitionContext,
  VALID_STATUS_TRANSITIONS,
  STATUS_REQUIRES_REASON,
} from '../types/appointment.types';
import { logger } from '../utils/logger';
import AuditEngine from './auditEngine';
import FinanceEngine from './financeEngine';
import ReportEngine from './reportEngine';
import CommunicationEngine from './communicationEngine';
import DocumentEngine from './documentEngine';

interface AppointmentQueryOptions {
  limit?: number;
  offset?: number;
  status?: AppointmentStatus;
  appointment_type?: AppointmentType;
  date_from?: string;
  date_to?: string;
  attorney_id?: string;
  expert_id?: string;
}

interface ChecklistUpdatePayload {
  appointment_id: string;
  checklist_item_id: string;
  completed: boolean;
  completed_by: string;
}

export class AppointmentEngine {
  /**
   * Create a new appointment
   * Initial status is DRAFT. Requires approval before scheduling.
   * @param payload - Appointment creation details
   * @param actor_id - User creating appointment
   * @returns Promise<AppointmentMasterRecord> - Created appointment
   */
  static async createAppointment(
    payload: CreateAppointmentPayload,
    actor_id: string
  ): Promise<AppointmentMasterRecord> {
    try {
      const { appointment_type, appointment_datetime, venue, duration_minutes, claimant_id, attorney_id, created_by } =
        payload;

      // Validate inputs
      if (!appointment_type || !appointment_datetime || !venue || !claimant_id || !attorney_id) {
        throw new Error('Missing required appointment fields');
      }

      if (duration_minutes <= 0 || duration_minutes > 480) {
        throw new Error('Duration must be between 1 and 480 minutes');
      }

      const reference_number = this.generateReferenceNumber();

      // TODO: Replace with actual Supabase insert
      // const { data, error } = await supabase
      //   .from('appointments')
      //   .insert([{
      //     reference_number,
      //     status: 'DRAFT',
      //     appointment_type,
      //     appointment_datetime,
      //     venue,
      //     duration_minutes,
      //     claimant_id,
      //     attorney_id,
      //   }])
      //   .select()
      //   .single();

      const appointment: AppointmentMasterRecord = {
        id: `appt_${Date.now()}`,
        reference_number,
        status: 'DRAFT',
        appointment_type,
        appointment_datetime,
        venue,
        duration_minutes,
        claimant: {
          id: claimant_id,
          full_name: '',
          id_number: '',
          contact: '',
          address: '',
          injury_description: '',
        },
        attorney: {
          id: attorney_id,
          firm_name: '',
          attorney_name: '',
          contact: '',
          matter_reference: '',
        },
        expert: null,
        checklist: [],
        assessment: null,
        report: null,
        finance: null,
        communications: [],
        notes: [],
        timeline: [],
        documents: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // Log to audit trail
      await AuditEngine.logAction({
        actor_id,
        actor_name: 'Staff',
        actor_role: 'staff',
        action_type: 'APPT_CREATED',
        entity_type: 'APPOINTMENT',
        entity_id: appointment.id,
        after_state: appointment,
      });

      logger.info('Appointment created', {
        reference_number,
        appointment_type,
        appointment_datetime,
      });

      return appointment;
    } catch (error) {
      logger.error('Failed to create appointment', error as Error, {
        appointment_type: payload.appointment_type,
      });
      throw error;
    }
  }

  /**
   * Get appointment by ID or reference number
   * @param appointmentId - Appointment ID or reference number
   * @returns Promise<AppointmentMasterRecord> - Full appointment record
   */
  static async getAppointment(appointmentId: string): Promise<AppointmentMasterRecord> {
    try {
      // TODO: Replace with actual Supabase query
      // Can query by ID or reference_number
      // const { data, error } = await supabase
      //   .from('appointments')
      //   .select('*')
      //   .or(`id.eq.${appointmentId},reference_number.eq.${appointmentId}`)
      //   .single();

      logger.info('Appointment retrieved', { appointment_id: appointmentId });

      return {
        id: appointmentId,
        reference_number: '',
        status: 'DRAFT',
        appointment_type: 'ORTHOPAEDIC',
        appointment_datetime: '',
        venue: '',
        duration_minutes: 0,
        claimant: { id: '', full_name: '', id_number: '', contact: '', address: '', injury_description: '' },
        attorney: { id: '', firm_name: '', attorney_name: '', contact: '', matter_reference: '' },
        expert: null,
        checklist: [],
        assessment: null,
        report: null,
        finance: null,
        communications: [],
        notes: [],
        timeline: [],
        documents: [],
        created_at: '',
        updated_at: '',
      };
    } catch (error) {
      logger.error('Failed to get appointment', error as Error, { appointment_id: appointmentId });
      throw error;
    }
  }

  /**
   * Query appointments with filters
   * @param options - Query filters (status, date range, people involved, etc.)
   * @returns Promise<{ appointments: AppointmentMasterRecord[]; total: number }>
   */
  static async queryAppointments(options: AppointmentQueryOptions): Promise<{
    appointments: AppointmentMasterRecord[];
    total: number;
  }> {
    try {
      const { limit = 50, offset = 0, status, appointment_type, date_from, date_to, attorney_id, expert_id } = options;

      // TODO: Replace with actual Supabase query with filters
      // Build query conditionally based on provided filters

      logger.info('Appointments queried', {
        limit,
        offset,
        filters: { status, appointment_type },
      });

      return {
        appointments: [],
        total: 0,
      };
    } catch (error) {
      logger.error('Failed to query appointments', error as Error, { options });
      throw error;
    }
  }

  /**
   * Change appointment status (STATE MACHINE)
   * Validates transition is allowed per VALID_STATUS_TRANSITIONS
   * Handles side effects (notifications, automatic actions) per new status
   * @param context - Transition context
   * @returns Promise<AppointmentMasterRecord> - Updated appointment
   */
  static async changeStatus(context: StatusTransitionContext): Promise<AppointmentMasterRecord> {
    try {
      const { currentStatus, nextStatus, actorId, actorRole, reason } = context;

      // Validate transition is allowed
      const allowedTransitions = VALID_STATUS_TRANSITIONS[currentStatus] || [];
      if (!allowedTransitions.includes(nextStatus)) {
        throw new Error(
          `Invalid status transition: ${currentStatus} -> ${nextStatus}. Allowed transitions: ${allowedTransitions.join(', ')}`
        );
      }

      // Validate reason is provided for sensitive transitions
      if (STATUS_REQUIRES_REASON.includes(nextStatus) && !reason) {
        throw new Error(`Reason is required for status: ${nextStatus}`);
      }

      // TODO: Replace with actual Supabase update
      // const { data, error } = await supabase
      //   .from('appointments')
      //   .update({ status: nextStatus })
      //   .eq('id', appointmentId)
      //   .select()
      //   .single();

      // Log to audit trail
      await AuditEngine.logAction({
        actor_id: actorId,
        actor_name: 'User',
        actor_role: actorRole,
        action_type: 'APPT_STATUS_CHANGED',
        entity_type: 'APPOINTMENT',
        entity_id: 'appt_id',
        before_state: { status: currentStatus },
        after_state: { status: nextStatus },
        metadata: { reason },
      });

      // Handle side effects based on new status
      await this.handleStatusTransitionSideEffects(nextStatus, 'appt_id');

      logger.info('Appointment status changed', {
        current_status: currentStatus,
        next_status: nextStatus,
        actor_id: actorId,
      });

      return {
        id: 'appt_id',
        reference_number: '',
        status: nextStatus,
        appointment_type: 'ORTHOPAEDIC',
        appointment_datetime: '',
        venue: '',
        duration_minutes: 0,
        claimant: { id: '', full_name: '', id_number: '', contact: '', address: '', injury_description: '' },
        attorney: { id: '', firm_name: '', attorney_name: '', contact: '', matter_reference: '' },
        expert: null,
        checklist: [],
        assessment: null,
        report: null,
        finance: null,
        communications: [],
        notes: [],
        timeline: [],
        documents: [],
        created_at: '',
        updated_at: new Date().toISOString(),
      };
    } catch (error) {
      logger.error('Failed to change appointment status', error as Error, context);
      throw error;
    }
  }

  /**
   * Assign an expert to an appointment
   * Only allowed if appointment is in APPROVED status
   * @param appointmentId - Appointment ID
   * @param expertId - Expert ID
   * @param assignedBy - User ID
   * @returns Promise<AppointmentMasterRecord> - Updated appointment
   */
  static async assignExpert(appointmentId: string, expertId: string, assignedBy: string): Promise<AppointmentMasterRecord> {
    try {
      // TODO: Replace with actual Supabase update
      // Check current status is APPROVED
      // Update expert_id
      // Generate invoice from fee schedule

      // Log to audit trail
      await AuditEngine.logAction({
        actor_id: assignedBy,
        actor_name: 'Admin',
        actor_role: 'admin',
        action_type: 'APPT_EXPERT_ASSIGNED',
        entity_type: 'APPOINTMENT',
        entity_id: appointmentId,
        after_state: { expert_id: expertId },
      });

      logger.info('Expert assigned to appointment', {
        appointment_id: appointmentId,
        expert_id: expertId,
      });

      return {
        id: appointmentId,
        reference_number: '',
        status: 'SCHEDULED',
        appointment_type: 'ORTHOPAEDIC',
        appointment_datetime: '',
        venue: '',
        duration_minutes: 0,
        claimant: { id: '', full_name: '', id_number: '', contact: '', address: '', injury_description: '' },
        attorney: { id: '', firm_name: '', attorney_name: '', contact: '', matter_reference: '' },
        expert: { id: expertId, full_name: '', specialisation: '', practice_number: '', availability_confirmed: true },
        checklist: [],
        assessment: null,
        report: null,
        finance: null,
        communications: [],
        notes: [],
        timeline: [],
        documents: [],
        created_at: '',
        updated_at: new Date().toISOString(),
      };
    } catch (error) {
      logger.error('Failed to assign expert', error as Error, { appointment_id: appointmentId, expert_id: expertId });
      throw error;
    }
  }

  /**
   * Reschedule an appointment to a new date/time/venue
   * @param appointmentId - Appointment ID
   * @param new_datetime - New appointment date/time
   * @param new_venue - New venue (optional)
   * @param rescheduled_by - User ID
   * @returns Promise<AppointmentMasterRecord> - Updated appointment
   */
  static async rescheduleAppointment(
    appointmentId: string,
    new_datetime: string,
    new_venue: string | null,
    rescheduled_by: string
  ): Promise<AppointmentMasterRecord> {
    try {
      // TODO: Replace with actual Supabase update + notifications
      // Update appointment_datetime and venue
      // Send rescheduling notifications to all parties
      // Log to audit trail

      logger.info('Appointment rescheduled', {
        appointment_id: appointmentId,
        new_datetime,
      });

      return {
        id: appointmentId,
        reference_number: '',
        status: 'SCHEDULED',
        appointment_type: 'ORTHOPAEDIC',
        appointment_datetime: new_datetime,
        venue: new_venue || '',
        duration_minutes: 0,
        claimant: { id: '', full_name: '', id_number: '', contact: '', address: '', injury_description: '' },
        attorney: { id: '', firm_name: '', attorney_name: '', contact: '', matter_reference: '' },
        expert: null,
        checklist: [],
        assessment: null,
        report: null,
        finance: null,
        communications: [],
        notes: [],
        timeline: [],
        documents: [],
        created_at: '',
        updated_at: new Date().toISOString(),
      };
    } catch (error) {
      logger.error('Failed to reschedule appointment', error as Error, {
        appointment_id: appointmentId,
      });
      throw error;
    }
  }

  /**
   * Update appointment checklist item
   * @param payload - Checklist update details
   * @returns Promise<any> - Updated checklist
   */
  static async updateChecklist(payload: ChecklistUpdatePayload): Promise<any> {
    try {
      const { appointment_id, checklist_item_id, completed, completed_by } = payload;

      // TODO: Replace with actual Supabase update
      // Update checklist_items table

      // Log to audit trail
      await AuditEngine.logAction({
        actor_id: completed_by,
        actor_name: 'Staff',
        actor_role: 'staff',
        action_type: 'APPT_CHECKLIST_UPDATED',
        entity_type: 'APPOINTMENT',
        entity_id: appointment_id,
        metadata: { checklist_item_id, completed },
      });

      logger.info('Checklist item updated', {
        appointment_id,
        checklist_item_id,
        completed,
      });

      return { id: checklist_item_id, completed };
    } catch (error) {
      logger.error('Failed to update checklist', error as Error, {
        appointment_id: payload.appointment_id,
      });
      throw error;
    }
  }

  /**
   * Cancel an appointment
   * Only cancellable from certain states. Requires reason.
   * @param appointmentId - Appointment ID
   * @param reason - Cancellation reason
   * @param cancelled_by - User ID
   * @returns Promise<AppointmentMasterRecord> - Cancelled appointment
   */
  static async cancelAppointment(
    appointmentId: string,
    reason: string,
    cancelled_by: string
  ): Promise<AppointmentMasterRecord> {
    try {
      if (!reason || reason.trim().length === 0) {
        throw new Error('Cancellation reason is required');
      }

      // TODO: Replace with actual Supabase update
      // Check current status allows cancellation
      // Update status to CANCELLED
      // Notify all parties

      logger.info('Appointment cancelled', {
        appointment_id: appointmentId,
        reason,
      });

      return {
        id: appointmentId,
        reference_number: '',
        status: 'CANCELLED',
        appointment_type: 'ORTHOPAEDIC',
        appointment_datetime: '',
        venue: '',
        duration_minutes: 0,
        claimant: { id: '', full_name: '', id_number: '', contact: '', address: '', injury_description: '' },
        attorney: { id: '', firm_name: '', attorney_name: '', contact: '', matter_reference: '' },
        expert: null,
        checklist: [],
        assessment: null,
        report: null,
        finance: null,
        communications: [],
        notes: [],
        timeline: [],
        documents: [],
        created_at: '',
        updated_at: new Date().toISOString(),
      };
    } catch (error) {
      logger.error('Failed to cancel appointment', error as Error, {
        appointment_id: appointmentId,
      });
      throw error;
    }
  }

  /**
   * Handle automatic side effects when appointment transitions to new status
   * Called internally by changeStatus()
   * @param newStatus - New status
   * @param appointmentId - Appointment ID
   */
  private static async handleStatusTransitionSideEffects(newStatus: AppointmentStatus, appointmentId: string): Promise<void> {
    try {
      switch (newStatus) {
        case 'APPROVED':
          // TODO: Initialize checklist from template
          // Send notification to admin to assign expert
          break;

        case 'SCHEDULED':
          // TODO: Generate invoice if not exists
          // Send confirmation to all parties
          break;

        case 'CONFIRMED':
          // TODO: Send final reminders (24h, 1h)
          // Verify expert availability
          break;

        case 'IN_PROGRESS':
          // TODO: Start assessment period timer
          // Lock appointment for editing
          break;

        case 'ASSESSMENT_COMPLETE':
          // TODO: Notify expert to submit report
          // Start report submission deadline countdown
          break;

        case 'REPORT_SUBMITTED':
          // TODO: Notify admin to review report
          // Queue for review process
          break;

        case 'INVOICE_PENDING':
          // TODO: Ensure invoice generated and sent
          // Set payment due date
          break;

        case 'PAID':
          // TODO: Send receipt to attorney
          // Send payment confirmation to expert
          break;

        case 'ARCHIVED':
          // TODO: Final cleanup, remove from active views
          break;
      }
    } catch (error) {
      logger.error('Failed to handle status transition side effects', error as Error, {
        new_status: newStatus,
        appointment_id: appointmentId,
      });
    }
  }

  /**
   * Generate unique reference number for appointment
   * Format: KAM-YYYY-NNNN (Kutlwano Associate Medico-Legal - Year - Sequence)
   * @returns string - Reference number
   */
  private static generateReferenceNumber(): string {
    const year = new Date().getFullYear();
    const sequence = Math.floor(Math.random() * 10000);
    return `KAM-${year}-${String(sequence).padStart(4, '0')}`;
  }
}

export default AppointmentEngine;
