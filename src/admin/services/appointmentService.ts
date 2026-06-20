/**
 * Appointment Service
 * Thin Supabase wrapper layer for appointment operations
 * Calls appointmentEngine methods and handles database connectivity
 */

import AppointmentEngine from '../engines/appointmentEngine';
import {
  AppointmentMasterRecord,
  CreateAppointmentPayload,
  StatusTransitionContext,
  AppointmentQueryOptions,
} from '../types/appointment.types';
import { logger } from '../utils/logger';

export class AppointmentService {
  /**
   * Create a new appointment via the engine
   * @param payload - Appointment creation payload
   * @param actor_id - User creating the appointment
   * @returns Promise<AppointmentMasterRecord>
   */
  static async createAppointment(
    payload: CreateAppointmentPayload,
    actor_id: string
  ): Promise<AppointmentMasterRecord> {
    try {
      const appointment = await AppointmentEngine.createAppointment(payload, actor_id);

      // TODO: Insert into Supabase 'appointments' table
      // const { data, error } = await supabase
      //   .from('appointments')
      //   .insert([{
      //     reference_number: appointment.reference_number,
      //     status: appointment.status,
      //     appointment_type: appointment.appointment_type,
      //     appointment_datetime: appointment.appointment_datetime,
      //     venue: appointment.venue,
      //     duration_minutes: appointment.duration_minutes,
      //     claimant_id: payload.claimant_id,
      //     attorney_id: payload.attorney_id,
      //     created_by: actor_id,
      //   }])
      //   .select()
      //   .single();

      logger.info('Appointment created via service', {
        reference_number: appointment.reference_number,
      });

      return appointment;
    } catch (error) {
      logger.error('Appointment service: Failed to create appointment', error as Error);
      throw error;
    }
  }

  /**
   * Get appointment by ID or reference number
   * @param appointmentId - Appointment ID or reference number
   * @returns Promise<AppointmentMasterRecord>
   */
  static async getAppointment(appointmentId: string): Promise<AppointmentMasterRecord> {
    try {
      // TODO: Fetch from Supabase using complex join query
      // const { data, error } = await supabase
      //   .from('appointments')
      //   .select(`
      //     *,
      //     claimant:claimants(*),
      //     attorney:attorneys(*),
      //     expert:experts(*),
      //     checklist:appointment_checklist(*),
      //     assessment:assessments(*),
      //     report:reports(*),
      //     finance:invoices(*),
      //     communications:communications_log(*),
      //     notes:internal_notes(*),
      //     timeline:appointment_timeline(*),
      //     documents:documents(*)
      //   `)
      //   .or(`id.eq.${appointmentId},reference_number.eq.${appointmentId}`)
      //   .single();

      const appointment = await AppointmentEngine.getAppointment(appointmentId);

      logger.info('Appointment retrieved via service', {
        appointment_id: appointmentId,
      });

      return appointment;
    } catch (error) {
      logger.error('Appointment service: Failed to get appointment', error as Error);
      throw error;
    }
  }

  /**
   * Query appointments with filters, pagination, and sorting
   * @param options - Query options (filters, pagination, sorting)
   * @returns Promise with appointments array and total count
   */
  static async queryAppointments(options: AppointmentQueryOptions): Promise<{
    appointments: AppointmentMasterRecord[];
    total: number;
  }> {
    try {
      // TODO: Fetch from Supabase with conditional filters
      // let query = supabase.from('appointments').select('*', { count: 'exact' });
      // if (options.status) query = query.eq('status', options.status);
      // if (options.appointment_type) query = query.eq('appointment_type', options.appointment_type);
      // if (options.date_from) query = query.gte('appointment_datetime', options.date_from);
      // if (options.date_to) query = query.lte('appointment_datetime', options.date_to);
      // if (options.attorney_id) query = query.eq('attorney_id', options.attorney_id);
      // if (options.expert_id) query = query.eq('expert_id', options.expert_id);
      // query = query.order('appointment_datetime', { ascending: false })
      //   .range(options.offset || 0, (options.offset || 0) + (options.limit || 50) - 1);
      // const { data, count } = await query;

      const result = await AppointmentEngine.queryAppointments(options);

      logger.info('Appointments queried via service', {
        filters: options,
        count: result.total,
      });

      return result;
    } catch (error) {
      logger.error('Appointment service: Failed to query appointments', error as Error);
      throw error;
    }
  }

  /**
   * Change appointment status (calls engine state machine)
   * @param context - Status transition context
   * @returns Promise<AppointmentMasterRecord>
   */
  static async changeStatus(context: StatusTransitionContext): Promise<AppointmentMasterRecord> {
    try {
      const appointment = await AppointmentEngine.changeStatus(context);

      // TODO: Update Supabase 'appointments' table
      // const { data, error } = await supabase
      //   .from('appointments')
      //   .update({ status: context.nextStatus, updated_at: new Date().toISOString() })
      //   .eq('id', appointment.id)
      //   .select()
      //   .single();

      logger.info('Appointment status changed via service', {
        status: context.nextStatus,
      });

      return appointment;
    } catch (error) {
      logger.error('Appointment service: Failed to change status', error as Error, context);
      throw error;
    }
  }

  /**
   * Assign expert to appointment
   * @param appointmentId - Appointment ID
   * @param expertId - Expert ID
   * @param assignedBy - User ID
   * @returns Promise<AppointmentMasterRecord>
   */
  static async assignExpert(
    appointmentId: string,
    expertId: string,
    assignedBy: string
  ): Promise<AppointmentMasterRecord> {
    try {
      const appointment = await AppointmentEngine.assignExpert(appointmentId, expertId, assignedBy);

      // TODO: Update Supabase
      // const { data, error } = await supabase
      //   .from('appointments')
      //   .update({ expert_id: expertId, updated_at: new Date().toISOString() })
      //   .eq('id', appointmentId)
      //   .select()
      //   .single();

      logger.info('Expert assigned via service', {
        appointment_id: appointmentId,
        expert_id: expertId,
      });

      return appointment;
    } catch (error) {
      logger.error('Appointment service: Failed to assign expert', error as Error);
      throw error;
    }
  }

  /**
   * Reschedule an appointment
   * @param appointmentId - Appointment ID
   * @param new_datetime - New appointment date/time
   * @param new_venue - New venue (optional)
   * @param rescheduled_by - User ID
   * @returns Promise<AppointmentMasterRecord>
   */
  static async rescheduleAppointment(
    appointmentId: string,
    new_datetime: string,
    new_venue: string | null,
    rescheduled_by: string
  ): Promise<AppointmentMasterRecord> {
    try {
      const appointment = await AppointmentEngine.rescheduleAppointment(
        appointmentId,
        new_datetime,
        new_venue,
        rescheduled_by
      );

      // TODO: Update Supabase
      // const { data, error } = await supabase
      //   .from('appointments')
      //   .update({
      //     appointment_datetime: new_datetime,
      //     venue: new_venue || undefined,
      //     updated_at: new Date().toISOString(),
      //   })
      //   .eq('id', appointmentId)
      //   .select()
      //   .single();

      logger.info('Appointment rescheduled via service', {
        appointment_id: appointmentId,
        new_datetime,
      });

      return appointment;
    } catch (error) {
      logger.error('Appointment service: Failed to reschedule appointment', error as Error);
      throw error;
    }
  }

  /**
   * Update checklist item
   * @param appointmentId - Appointment ID
   * @param checklistItemId - Checklist item ID
   * @param completed - Completion status
   * @param completedBy - User ID
   * @returns Promise
   */
  static async updateChecklist(
    appointmentId: string,
    checklistItemId: string,
    completed: boolean,
    completedBy: string
  ): Promise<Awaited<ReturnType<typeof AppointmentEngine.updateChecklist>>> {
    try {
      const result = await AppointmentEngine.updateChecklist({
        appointment_id: appointmentId,
        checklist_item_id: checklistItemId,
        completed,
        completed_by: completedBy,
      });

      // TODO: Update Supabase 'appointment_checklist' table
      // const { data, error } = await supabase
      //   .from('appointment_checklist')
      //   .update({
      //     completed,
      //     completed_at: completed ? new Date().toISOString() : null,
      //     completed_by: completed ? completedBy : null,
      //   })
      //   .eq('id', checklistItemId)
      //   .eq('appointment_id', appointmentId)
      //   .select()
      //   .single();

      logger.info('Checklist updated via service', {
        appointment_id: appointmentId,
        checklist_item_id: checklistItemId,
      });

      return result;
    } catch (error) {
      logger.error('Appointment service: Failed to update checklist', error as Error);
      throw error;
    }
  }

  /**
   * Cancel appointment
   * @param appointmentId - Appointment ID
   * @param reason - Cancellation reason
   * @param cancelledBy - User ID
   * @returns Promise<AppointmentMasterRecord>
   */
  static async cancelAppointment(
    appointmentId: string,
    reason: string,
    cancelledBy: string
  ): Promise<AppointmentMasterRecord> {
    try {
      const appointment = await AppointmentEngine.cancelAppointment(appointmentId, reason, cancelledBy);

      // TODO: Update Supabase
      // const { data, error } = await supabase
      //   .from('appointments')
      //   .update({ status: 'CANCELLED', updated_at: new Date().toISOString() })
      //   .eq('id', appointmentId)
      //   .select()
      //   .single();

      logger.info('Appointment cancelled via service', {
        appointment_id: appointmentId,
      });

      return appointment;
    } catch (error) {
      logger.error('Appointment service: Failed to cancel appointment', error as Error);
      throw error;
    }
  }

  /**
   * Get appointment timeline (audit history)
   * @param appointmentId - Appointment ID
   * @returns Promise
   */
  static async getAppointmentTimeline(appointmentId: string): Promise<Awaited<ReturnType<typeof AppointmentEngine.getAppointment>>['timeline']> {
    try {
      // TODO: Fetch from Supabase 'appointment_timeline' table
      // const { data, error } = await supabase
      //   .from('appointment_timeline')
      //   .select('*')
      //   .eq('appointment_id', appointmentId)
      //   .order('created_at', { ascending: true });

      logger.info('Appointment timeline retrieved via service', {
        appointment_id: appointmentId,
      });

      return [];
    } catch (error) {
      logger.error('Appointment service: Failed to get timeline', error as Error);
      throw error;
    }
  }
}

export default AppointmentService;