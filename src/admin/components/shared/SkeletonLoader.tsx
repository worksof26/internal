import type { ReactNode } from 'react';

interface SkeletonLoaderProps {
  rows?: number;
  type: 'table' | 'card' | 'list';
}

export function SkeletonLoader({ rows = 3, type }: SkeletonLoaderProps): ReactNode {
  return (
    <div className={`admin-skeleton admin-skeleton--${type}`} aria-busy="true" aria-live="polite">
      {Array.from({ length: rows }, (_, index) => (
        <span key={index} className="admin-skeleton__row" />
      ))}
    </div>
  );
}

export default SkeletonLoader;
