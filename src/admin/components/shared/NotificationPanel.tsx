import { useCallback, useEffect, useState, type ReactNode } from 'react';
import NotificationService from '../../services/notificationService';
import type { Notification } from '../../types/system.types';
import EmptyState from './EmptyState';
import ErrorCard from './ErrorCard';
import SkeletonLoader from './SkeletonLoader';

interface NotificationPanelProps {
  userId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationPanel({ userId, isOpen, onClose }: NotificationPanelProps): ReactNode {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadNotifications = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      const nextNotifications = await NotificationService.getUserNotifications(userId);
      setNotifications(nextNotifications);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Notifications could not be loaded.');
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (!isOpen) return undefined;
    void loadNotifications();
    return NotificationService.subscribeToNotifications(userId, (notification) => {
      setNotifications((current) => [notification, ...current]);
    });
  }, [isOpen, loadNotifications, userId]);

  const markAsRead = async (notificationId: string): Promise<void> => {
    const updated = await NotificationService.markAsRead(notificationId);
    setNotifications((current) => current.map((notification) => (notification.id === notificationId ? updated : notification)));
  };

  const markAllAsRead = async (): Promise<void> => {
    await NotificationService.markAllAsRead(userId);
    setNotifications((current) => current.map((notification) => ({ ...notification, read_at: notification.read_at ?? new Date().toISOString() })));
  };

  return (
    <aside className={isOpen ? 'admin-notification-panel admin-notification-panel--open' : 'admin-notification-panel'} aria-hidden={!isOpen} aria-label="Notifications">
      <header className="admin-notification-panel__header">
        <h2 className="admin-notification-panel__title">Notifications</h2>
        <button type="button" className="admin-notification-panel__mark-all" onClick={markAllAsRead} disabled={notifications.length === 0}>Mark all read</button>
        <button type="button" className="admin-notification-panel__close" onClick={onClose} aria-label="Close notifications">×</button>
      </header>
      {isLoading ? <SkeletonLoader type="list" rows={5} /> : null}
      {error ? <ErrorCard message={error} onRetry={loadNotifications} /> : null}
      {!isLoading && !error && notifications.length === 0 ? <EmptyState title="No notifications" message="You have no in-app notifications at the moment." /> : null}
      {!isLoading && !error && notifications.length > 0 ? (
        <ul className="admin-notification-panel__list">
          {notifications.map((notification) => (
            <li key={notification.id} className={notification.read_at ? 'admin-notification-panel__item' : 'admin-notification-panel__item admin-notification-panel__item--unread'}>
              <div className="admin-notification-panel__content">
                <strong>{notification.title}</strong>
                <p>{notification.body}</p>
                {notification.link ? <a href={notification.link}>Open</a> : null}
              </div>
              {!notification.read_at ? <button type="button" onClick={() => void markAsRead(notification.id)}>Mark read</button> : null}
            </li>
          ))}
        </ul>
      ) : null}
    </aside>
  );
}

export default NotificationPanel;
