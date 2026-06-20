import type { ChangeEvent, ReactNode } from 'react';
import type { FilterConfig } from '../../types/system.types';

type ActiveFilters = Record<string, string | boolean | string[]>;

interface FilterBarProps {
  filters: FilterConfig[];
  activeFilters: ActiveFilters;
  onChange: (key: string, value: string | boolean | string[]) => void;
}

export function FilterBar({ filters, activeFilters, onChange }: FilterBarProps): ReactNode {
  const handleInput = (key: string) => (event: ChangeEvent<HTMLInputElement>): void => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    onChange(key, value);
  };

  const handleSelect = (key: string) => (event: ChangeEvent<HTMLSelectElement>): void => {
    const selected = Array.from(event.target.selectedOptions, (option) => option.value);
    onChange(key, event.target.multiple ? selected : event.target.value);
  };

  return (
    <div className="admin-filter-bar" aria-label="Filters">
      {filters.map((filter) => {
        const activeValue = activeFilters[filter.key];
        if (filter.type === 'SELECT') {
          const selectValue = Array.isArray(activeValue) ? activeValue : typeof activeValue === 'string' ? activeValue : '';
          return (
            <label key={filter.key} className="admin-filter-bar__field">
              <span className="admin-filter-bar__label">{filter.label}</span>
              <select className="admin-filter-bar__select" multiple={filter.multi} value={selectValue} onChange={handleSelect(filter.key)}>
                <option value="">All</option>
                {(filter.options ?? []).map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </label>
          );
        }

        if (filter.type === 'CHECKBOX') {
          return (
            <label key={filter.key} className="admin-filter-bar__checkbox">
              <input type="checkbox" checked={activeValue === true} onChange={handleInput(filter.key)} />
              <span>{filter.label}</span>
            </label>
          );
        }

        return (
          <label key={filter.key} className="admin-filter-bar__field">
            <span className="admin-filter-bar__label">{filter.label}</span>
            <input
              className="admin-filter-bar__input"
              type={filter.type === 'DATE_RANGE' ? 'date' : 'search'}
              value={typeof activeValue === 'string' ? activeValue : ''}
              placeholder={filter.placeholder}
              onChange={handleInput(filter.key)}
            />
          </label>
        );
      })}
    </div>
  );
}

export default FilterBar;
