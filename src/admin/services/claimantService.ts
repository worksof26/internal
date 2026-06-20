/** Claimant Service - Supabase access layer for claimant CRM records. */
import { createClient } from '@supabase/supabase-js';
import { Claimant, ClaimantAppointmentHistory, CRMFilterOptions } from '../types/crm.types';
import { logger } from '../utils/logger';

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL || '', import.meta.env.VITE_SUPABASE_ANON_KEY || '');

export class ClaimantService {
  static async listClaimants(filters: CRMFilterOptions = {}): Promise<Claimant[]> {
    let query = supabase.from('claimants').select('*').eq('is_deleted', false);
    if (filters.search_term) query = query.or(`full_name.ilike.%${filters.search_term}%,id_number.ilike.%${filters.search_term}%,email.ilike.%${filters.search_term}%`);
    const { data, error } = await query.order(filters.sort_by === 'DATE_CREATED' ? 'created_at' : 'full_name', { ascending: filters.sort_order !== 'DESC' });
    if (error) throw new Error(error.message);
    logger.info('Claimants fetched via service', { count: data?.length ?? 0 });
    return (data ?? []) as Claimant[];
  }

  static async getClaimant(id: string): Promise<Claimant> {
    const { data, error } = await supabase.from('claimants').select('*').eq('id', id).eq('is_deleted', false).single();
    if (error) throw new Error(error.message);
    return data as Claimant;
  }

  static async getAppointmentHistory(claimantId: string): Promise<ClaimantAppointmentHistory> {
    const { data, error } = await supabase.from('appointments').select('id, reference_number, appointment_type, appointment_datetime, status, experts(full_name), attorneys(attorney_name)').eq('claimant_id', claimantId).order('appointment_datetime', { ascending: false });
    if (error) throw new Error(error.message);
    return { claimant_id: claimantId, appointments: (data ?? []).map((row) => ({ id: String(row.id), reference_number: String(row.reference_number), appointment_type: String(row.appointment_type), appointment_date: String(row.appointment_datetime), expert_name: '', status: String(row.status), attorney_name: '' })) };
  }
}

export default ClaimantService;
