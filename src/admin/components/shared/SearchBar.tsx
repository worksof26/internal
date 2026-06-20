import type { ChangeEvent, ReactNode } from 'react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  onClear: () => void;
}

export function SearchBar({ value, onChange, placeholder, onClear }: SearchBarProps): ReactNode {
  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    onChange(event.target.value);
  };

  return (
    <div className="admin-search-bar" role="search">
      <input
        className="admin-search-bar__input"
        type="search"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        aria-label={placeholder}
      />
      {value ? (
        <button type="button" className="admin-search-bar__clear" onClick={onClear} aria-label="Clear search">
          Clear
        </button>
      ) : null}
    </div>
  );
}

export default SearchBar;
