/** Staff Service - Supabase access layer for internal staff profiles. */
import { createClient } from '@supabase/supabase-js';
import { UserProfile, UserRole } from '../types/user.types';
import { logger } from '../utils/logger';

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL || '', import.meta.env.VITE_SUPABASE_ANON_KEY || '');

type StaffRole = Extract<UserRole, 'admin' | 'staff' | 'finance' | 'viewer'>;

export class StaffService {
  static async listStaff(): Promise<UserProfile[]> {
    const { data, error } = await supabase.from('profiles').select('*').in('role', ['admin', 'staff', 'finance', 'viewer']).order('full_name', { ascending: true });
    if (error) throw new Error(error.message);
    logger.info('Staff fetched via service', { count: data?.length ?? 0 });
    return (data ?? []) as UserProfile[];
  }

  static async updateStaff(id: string, updates: Partial<Pick<UserProfile, 'full_name' | 'email' | 'status'>> & { role?: StaffRole }): Promise<UserProfile> {
    const { data, error } = await supabase.from('profiles').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', id).select('*').single();
    if (error) throw new Error(error.message);
    return data as UserProfile;
  }

  static async deactivateStaff(id: string): Promise<UserProfile> {
    return this.updateStaff(id, { status: 'INACTIVE' });
  }
}

export default StaffService;
