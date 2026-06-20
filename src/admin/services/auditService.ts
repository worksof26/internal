/**
 * Audit Service
 * Thin Supabase wrapper layer for audit logging operations
 * Calls auditEngine methods and handles database connectivity
 */

import { createClient } from '@supabase/supabase-js';
import AuditEngine from '../engines/auditEngine';
import { AuditLog, AuditFilterOptions, EntityType, AuditActionType } from '../types/audit.types';
import { logger } from '../utils/logger';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface LogActionPayload {
  actor_id: string;
  actor_name: string;
  actor_role: string;
  action_type: AuditActionType;
  entity_type: EntityType;
  entity_id: string;
  before_state?: Record<string, unknown>;
  after_state?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
  ip_address?: string;
  user_agent?: string;
}

export class AuditService {
  /**
   * Log an action to the audit trail
   * @param payload - Audit log details
   * @returns Promise<AuditLog>
   */
  static async logAction(payload: LogActionPayload): Promise<AuditLog> {
    try {
      const auditLog = await AuditEngine.logAction(payload);

      // TODO: Insert into Supabase 'audit_logs' table
      // const { data, error } = await supabase
      //   .from('audit_logs')
      //   .insert([{
      //     actor_id: payload.actor_id,
      //     actor_name: payload.actor_name,
      //     actor_role: payload.actor_role,
      //     action_type: payload.action_type,
      //     entity_type: payload.entity_type,
      //     entity_id: payload.entity_id,
      //     before_state: payload.before_state,
      //     after_state: payload.after_state,
      //     metadata: payload.metadata,
      //     ip_address: payload.ip_address,
      //     user_agent: payload.user_agent,
      //   }])
      //   .select()
      //   .single();

      logger.info('Audit log created via service', {
        action: payload.action_type,
        entity: payload.entity_type,
      });

      return auditLog;
    } catch (error) {
      logger.error('Audit service: Failed to log action', error as Error);
      throw error;
    }
  }

  /**
   * Query audit logs with filters
   * @param filters - Query filters
   * @returns Promise with logs array and pagination
   */
  static async getAuditLog(filters: AuditFilterOptions): Promise<{
    logs: AuditLog[];
    total: number;
    limit: number;
    offset: number;
  }> {
    try {
      // TODO: Fetch from Supabase 'audit_logs' table with conditional filters
      // let query = supabase.from('audit_logs').select('*', { count: 'exact' });
      // if (filters.actor_id) query = query.eq('actor_id', filters.actor_id);
      // if (filters.action_type) query = query.eq('action_type', filters.action_type);
      // if (filters.entity_type) query = query.eq('entity_type', filters.entity_type);
      // if (filters.entity_id) query = query.eq('entity_id', filters.entity_id);
      // if (filters.date_from) query = query.gte('created_at', filters.date_from);
      // if (filters.date_to) query = query.lte('created_at', filters.date_to);
      // query = query.order('created_at', { ascending: false })
      //   .range(filters.offset || 0, (filters.offset || 0) + (filters.limit || 100) - 1);
      // const { data, count } = await query;

      const result = await AuditEngine.getAuditLog(filters);

      logger.info('Audit logs queried via service', {
        filters,
        total: result.total,
      });

      return result;
    } catch (error) {
      logger.error('Audit service: Failed to query audit logs', error as Error);
      throw error;
    }
  }

  /**
   * Get complete history for an entity
   * @param entityType - Type of entity
   * @param entityId - Entity ID
   * @returns Promise
   */
  static async getEntityHistory(entityType: EntityType, entityId: string): Promise<{
    entity_type: EntityType;
    entity_id: string;
    events: AuditLog[];
  }> {
    try {
      // TODO: Fetch from Supabase 'audit_logs' table
      // const { data, error } = await supabase
      //   .from('audit_logs')
      //   .select('*')
      //   .eq('entity_type', entityType)
      //   .eq('entity_id', entityId)
      //   .order('created_at', { ascending: true });

      const result = await AuditEngine.getEntityHistory(entityType, entityId);

      logger.info('Entity history retrieved via service', {
        entity_type: entityType,
        entity_id: entityId,
      });

      return result;
    } catch (error) {
      logger.error('Audit service: Failed to get entity history', error as Error);
      throw error;
    }
  }

  /**
   * Get user activity log within date range
   * @param userId - User ID
   * @param dateFrom - Start date (ISO 8601)
   * @param dateTo - End date (ISO 8601)
   * @returns Promise
   */
  static async getUserActivityLog(
    userId: string,
    dateFrom: string,
    dateTo: string
  ): Promise<{
    user_id: string;
    user_name: string;
    total_activities: number;
    activities: AuditLog[];
  }> {
    try {
      // TODO: Fetch from Supabase with joins to profiles table
      // const { data, error } = await supabase
      //   .from('audit_logs')
      //   .select('*, profiles!inner(full_name)')
      //   .eq('actor_id', userId)
      //   .gte('created_at', dateFrom)
      //   .lte('created_at', dateTo)
      //   .order('created_at', { ascending: false });

      const result = await AuditEngine.getUserActivityLog(userId, dateFrom, dateTo);

      logger.info('User activity log retrieved via service', {
        user_id: userId,
        date_range: { from: dateFrom, to: dateTo },
      });

      return result;
    } catch (error) {
      logger.error('Audit service: Failed to get user activity log', error as Error);
      throw error;
    }
  }

  /**
   * Export audit logs (full result set, no pagination)
   * @param filters - Query filters
   * @returns Promise<AuditLog[]>
   */
  static async exportAuditLogs(filters: AuditFilterOptions): Promise<AuditLog[]> {
    try {
      // TODO: Fetch full result set from Supabase
      // let query = supabase.from('audit_logs').select('*');
      // Apply filters conditionally...
      // return data || [];

      const result = await AuditEngine.exportAuditLogs(filters);

      logger.info('Audit logs exported via service', {
        count: result.length,
      });

      return result;
    } catch (error) {
      logger.error('Audit service: Failed to export audit logs', error as Error);
      throw error;
    }
  }

  /**
   * Get audit summary statistics
   * @param dateFrom - Start date
   * @param dateTo - End date
   * @returns Promise with counts by action and entity type
   */
  static async getAuditSummary(
    dateFrom: string,
    dateTo: string
  ): Promise<{
    by_action: Record<string, number>;
    by_entity: Record<string, number>;
  }> {
    try {
      // TODO: Aggregate query from Supabase 'audit_logs' table
      // Group by action_type and entity_type, count results

      const result = await AuditEngine.getAuditSummary(dateFrom, dateTo);

      logger.info('Audit summary retrieved via service', {
        date_range: { from: dateFrom, to: dateTo },
      });

      return result;
    } catch (error) {
      logger.error('Audit service: Failed to get audit summary', error as Error);
      throw error;
    }
  }
}

export default AuditService;