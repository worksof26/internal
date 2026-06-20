/** Attorney Service - Supabase access layer for attorney CRM records. */
import { createClient } from '@supabase/supabase-js';
import { Attorney, CRMFilterOptions } from '../types/crm.types';
import { logger } from '../utils/logger';

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL || '', import.meta.env.VITE_SUPABASE_ANON_KEY || '');

export class AttorneyService {
  static async listAttorneys(filters: CRMFilterOptions = {}): Promise<Attorney[]> {
    let query = supabase.from('attorneys').select('*').eq('is_deleted', false);
    if (filters.search_term) query = query.or(`firm_name.ilike.%${filters.search_term}%,attorney_name.ilike.%${filters.search_term}%,email.ilike.%${filters.search_term}%`);
    if (filters.status) query = query.eq('portal_status', filters.status);
    const { data, error } = await query.order(filters.sort_by === 'DATE_CREATED' ? 'created_at' : 'firm_name', { ascending: filters.sort_order !== 'DESC' });
    if (error) throw new Error(error.message);
    logger.info('Attorneys fetched via service', { count: data?.length ?? 0 });
    return (data ?? []) as Attorney[];
  }

  static async getAttorney(id: string): Promise<Attorney> {
    const { data, error } = await supabase.from('attorneys').select('*').eq('id', id).eq('is_deleted', false).single();
    if (error) throw new Error(error.message);
    return data as Attorney;
  }

  static async updateAttorney(id: string, updates: Partial<Attorney>): Promise<Attorney> {
    const { data, error } = await supabase.from('attorneys').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', id).select('*').single();
    if (error) throw new Error(error.message);
    return data as Attorney;
  }
}

export default AttorneyService;
