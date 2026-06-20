import type { ReactNode } from 'react';

interface EmptyStateProps {
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ title, message, actionLabel, onAction }: EmptyStateProps): ReactNode {
  return (
    <section className="admin-empty-state" aria-live="polite">
      <h3 className="admin-empty-state__title">{title}</h3>
      <p className="admin-empty-state__message">{message}</p>
      {actionLabel && onAction ? (
        <button type="button" className="admin-empty-state__action" onClick={onAction}>
          {actionLabel}
        </button>
      ) : null}
    </section>
  );
}

export default EmptyState;
