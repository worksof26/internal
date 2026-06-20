import type { ReactNode } from 'react';

type Trend = 'up' | 'down' | 'neutral';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: Trend;
  onClick?: () => void;
}

export function StatCard({ title, value, subtitle, trend = 'neutral', onClick }: StatCardProps): ReactNode {
  const content = (
    <>
      <div className="admin-stat-card__header">
        <span className="admin-stat-card__title">{title}</span>
        <span className={`admin-stat-card__trend admin-stat-card__trend--${trend}`} aria-label={`Trend ${trend}`} />
      </div>
      <strong className="admin-stat-card__value">{value}</strong>
      {subtitle ? <span className="admin-stat-card__subtitle">{subtitle}</span> : null}
    </>
  );

  if (onClick) {
    return (
      <button type="button" className="admin-stat-card admin-stat-card--button" onClick={onClick}>
        {content}
      </button>
    );
  }

  return <article className="admin-stat-card">{content}</article>;
}

export default StatCard;
