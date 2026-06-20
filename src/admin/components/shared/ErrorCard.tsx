import type { ReactNode } from 'react';

interface ErrorCardProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorCard({ message, onRetry }: ErrorCardProps): ReactNode {
  return (
    <section className="admin-error-card" role="alert">
      <h3 className="admin-error-card__title">Unable to load data</h3>
      <p className="admin-error-card__message">{message}</p>
      {onRetry ? (
        <button type="button" className="admin-error-card__retry" onClick={onRetry}>
          Retry
        </button>
      ) : null}
    </section>
  );
}

export default ErrorCard;
