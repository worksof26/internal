import { useMemo, useState, type ReactNode } from 'react';
import type { TableColumn } from '../../types/system.types';
import EmptyState from './EmptyState';
import SkeletonLoader from './SkeletonLoader';

type SortDirection = 'ASC' | 'DESC';

interface DataTableProps<T extends Record<string, string | number | boolean | null | undefined>> {
  columns: TableColumn<T>[];
  rows: T[];
  loading: boolean;
  onRowClick?: (row: T) => void;
  emptyStateText: string;
}

function compareValues(a: string | number | boolean | null | undefined, b: string | number | boolean | null | undefined): number {
  if (a === b) return 0;
  if (a === null || a === undefined) return -1;
  if (b === null || b === undefined) return 1;
  return String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: 'base' });
}

export function DataTable<T extends Record<string, string | number | boolean | null | undefined>>({
  columns,
  rows,
  loading,
  onRowClick,
  emptyStateText,
}: DataTableProps<T>): ReactNode {
  const [sortKey, setSortKey] = useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('ASC');

  const sortedRows = useMemo(() => {
    if (!sortKey) return rows;
    return [...rows].sort((left, right) => {
      const result = compareValues(left[sortKey], right[sortKey]);
      return sortDirection === 'ASC' ? result : -result;
    });
  }, [rows, sortDirection, sortKey]);

  const toggleSort = (column: TableColumn<T>): void => {
    if (!column.sortable) return;
    setSortKey((current) => {
      if (current === column.key) {
        setSortDirection((direction) => (direction === 'ASC' ? 'DESC' : 'ASC'));
        return current;
      }
      setSortDirection('ASC');
      return column.key;
    });
  };

  if (loading) return <SkeletonLoader type="table" rows={5} />;
  if (rows.length === 0) return <EmptyState title="No records found" message={emptyStateText} />;

  return (
    <div className="admin-data-table__wrap">
      <table className="admin-data-table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={String(column.key)} data-width={column.width} scope="col">
                <button
                  type="button"
                  className="admin-data-table__sort"
                  onClick={() => toggleSort(column)}
                  disabled={!column.sortable}
                  aria-sort={sortKey === column.key ? (sortDirection === 'ASC' ? 'ascending' : 'descending') : 'none'}
                >
                  {column.label}
                </button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedRows.map((row, rowIndex) => (
            <tr key={String(row.id ?? rowIndex)} className={onRowClick ? 'admin-data-table__row--clickable' : undefined} onClick={() => onRowClick?.(row)}>
              {columns.map((column) => {
                const value = row[column.key];
                return <td key={String(column.key)}>{column.render ? column.render(value, row) : String(value ?? '')}</td>;
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;
