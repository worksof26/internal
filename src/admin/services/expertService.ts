/** Expert Service - Supabase access layer for medical expert CRM records. */
import { createClient } from '@supabase/supabase-js';
import { CRMFilterOptions, Expert, ExpertAvailability } from '../types/crm.types';
import { logger } from '../utils/logger';

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL || '', import.meta.env.VITE_SUPABASE_ANON_KEY || '');

export class ExpertService {
  static async listExperts(filters: CRMFilterOptions = {}): Promise<Expert[]> {
    let query = supabase.from('experts').select('*').eq('is_deleted', false);
    if (filters.search_term) query = query.or(`full_name.ilike.%${filters.search_term}%,specialisation.ilike.%${filters.search_term}%,email.ilike.%${filters.search_term}%`);
    if (filters.status) query = query.eq('portal_status', filters.status);
    const { data, error } = await query.order(filters.sort_by === 'DATE_CREATED' ? 'created_at' : 'full_name', { ascending: filters.sort_order !== 'DESC' });
    if (error) throw new Error(error.message);
    logger.info('Experts fetched via service', { count: data?.length ?? 0 });
    return (data ?? []) as Expert[];
  }

  static async getExpert(id: string): Promise<Expert> {
    const { data, error } = await supabase.from('experts').select('*').eq('id', id).eq('is_deleted', false).single();
    if (error) throw new Error(error.message);
    return data as Expert;
  }

  static async getAvailability(expertId: string): Promise<ExpertAvailability[]> {
    const { data, error } = await supabase.from('expert_availability').select('*').eq('expert_id', expertId).order('date', { ascending: true });
    if (error) throw new Error(error.message);
    return (data ?? []) as ExpertAvailability[];
  }
}

export default ExpertService;
