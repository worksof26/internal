/**
 * Notification Service
 * Thin Supabase wrapper layer for notification operations
 * Calls notificationEngine methods and handles database connectivity
 */

import NotificationEngine from '../engines/notificationEngine';
import { Notification } from '../types/system.types';
import { logger } from '../utils/logger';

interface CreateNotificationPayload {
  userId: string;
  type: string;
  title: string;
  body: string;
  link?: string;
}

export class NotificationService {
  /**
   * Create a notification for a user
   * @param payload - Notification details
   * @returns Promise<Notification>
   */
  static async createNotification(payload: CreateNotificationPayload): Promise<Notification> {
    try {
      const notification = await NotificationEngine.createNotification({ user_id: payload.userId, type: payload.type as 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR', title: payload.title, message: payload.body, body: payload.body, link: payload.link });

      // TODO: Insert into Supabase 'notifications' table
      // const { data, error } = await supabase
      //   .from('notifications')
      //   .insert([{
      //     user_id: payload.userId,
      //     type: payload.type,
      //     title: payload.title,
      //     body: payload.body,
      //     link: payload.link,
      //     is_read: false,
      //   }])
      //   .select()
      //   .single();

      logger.info('Notification created via service', {
        user_id: payload.userId,
        type: payload.type,
      });

      return notification;
    } catch (error) {
      logger.error('Notification service: Failed to create notification', error as Error);
      throw error;
    }
  }

  /**
   * Mark notification as read
   * @param notificationId - Notification ID
   * @returns Promise
   */
  static async markAsRead(notificationId: string): Promise<Awaited<ReturnType<typeof NotificationEngine.markAsRead>>> {
    try {
      // TODO: Update Supabase 'notifications' table
      // const { data, error } = await supabase
      //   .from('notifications')
      //   .update({ is_read: true, read_at: new Date().toISOString() })
      //   .eq('id', notificationId)
      //   .select()
      //   .single();

      const result = await NotificationEngine.markAsRead(notificationId);

      logger.info('Notification marked as read via service', {
        notification_id: notificationId,
      });

      return result;
    } catch (error) {
      logger.error('Notification service: Failed to mark as read', error as Error);
      throw error;
    }
  }

  /**
   * Mark all notifications as read for a user
   * @param userId - User ID
   * @returns Promise
   */
  static async markAllAsRead(userId: string): Promise<Awaited<ReturnType<typeof NotificationEngine.markAllAsRead>>> {
    try {
      // TODO: Update all notifications for user in Supabase
      // const { data, error } = await supabase
      //   .from('notifications')
      //   .update({ is_read: true, read_at: new Date().toISOString() })
      //   .eq('user_id', userId)
      //   .eq('is_read', false)
      //   .select();

      const result = await NotificationEngine.markAllAsRead(userId);

      logger.info('All notifications marked as read via service', {
        user_id: userId,
      });

      return result;
    } catch (error) {
      logger.error('Notification service: Failed to mark all as read', error as Error);
      throw error;
    }
  }

  /**
   * Get notifications for a user
   * @param userId - User ID
   * @param limit - Result limit (default 50)
   * @param offset - Result offset for pagination
   * @returns Promise<Notification[]>
   */
  static async getUserNotifications(
    userId: string,
    _limit: number = 50,
    _offset: number = 0
  ): Promise<Notification[]> {
    try {
      // TODO: Fetch from Supabase 'notifications' table
      // const { data, error } = await supabase
      //   .from('notifications')
      //   .select('*')
      //   .eq('user_id', userId)
      //   .order('created_at', { ascending: false })
      //   .range(offset, offset + limit - 1);

      const result = await NotificationEngine.getUserNotifications(userId);

      logger.info('User notifications retrieved via service', {
        user_id: userId,
      });

      return result;
    } catch (error) {
      logger.error('Notification service: Failed to get notifications', error as Error);
      throw error;
    }
  }

  /**
   * Get unread notification count for user
   * @param userId - User ID
   * @returns Promise<number>
   */
  static async getUnreadCount(userId: string): Promise<number> {
    try {
      // TODO: Count unread notifications in Supabase
      // const { data, error, count } = await supabase
      //   .from('notifications')
      //   .select('*', { count: 'exact' })
      //   .eq('user_id', userId)
      //   .eq('is_read', false);

      const count = await NotificationEngine.getUnreadCount(userId);

      logger.info('Unread count retrieved via service', {
        user_id: userId,
        count,
      });

      return count;
    } catch (error) {
      logger.error('Notification service: Failed to get unread count', error as Error);
      throw error;
    }
  }

  /**
   * Subscribe to real-time notifications for a user
   * @param userId - User ID
   * @param callback - Callback function for new notifications
   * @returns Unsubscribe function
   */
  static subscribeToNotifications(userId: string, callback: (notification: Notification) => void): () => void {
    try {
      // TODO: Subscribe to Supabase realtime notifications channel
      // const subscription = supabase
      //   .channel(`notifications:user_id=eq.${userId}`)
      //   .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications' }, (payload) => {
      //     callback(payload.new as Notification);
      //   })
      //   .subscribe();

      const unsubscribe = NotificationEngine.subscribeToNotifications(userId, callback);

      logger.info('Subscribed to notifications via service', {
        user_id: userId,
      });

      return unsubscribe;
    } catch (error) {
      logger.error('Notification service: Failed to subscribe to notifications', error as Error);
      return () => {};
    }
  }
}

export default NotificationService;