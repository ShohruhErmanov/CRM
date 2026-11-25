import { useEffect, useRef } from 'react';
import { RotateCcw, Search, X } from 'lucide-react';
import {
  CUSTOMER_SEGMENTS,
  CUSTOMER_SORT_OPTIONS,
  CUSTOMER_SOURCES,
} from '../constants/customerOptions';
import { Button } from '../../../shared/components/ui';
import styles from './CustomerToolbar.module.css';

/**
 * Search and multi-axis filter bar optimized for keyboard-heavy CRM operators.
 */
export function CustomerToolbar({
  filters,
  operators = [],
  onFilterChange,
  onResetFilters,
  totalCount,
  filteredCount,
}) {
  const searchRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (event) => {
      const targetTag = event.target?.tagName?.toLowerCase();
      const isTyping =
        targetTag === 'input' ||
        targetTag === 'textarea' ||
        targetTag === 'select' ||
        event.target?.isContentEditable;

      if (event.key === '/' && !isTyping) {
        event.preventDefault();
        searchRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const hasActiveFilters =
    filters.search.trim() !== '' ||
    filters.status !== 'all' ||
    filters.segment !== 'all' ||
    filters.operator !== 'all' ||
    filters.source !== 'all' ||
    filters.sortBy !== 'updated_desc';

  return (
    <div className={styles.toolbar}>
      <div className={styles.row}>
        <div className={styles.searchWrap}>
          <Search size={16} className={styles.searchIcon} aria-hidden="true" />
          <input
            ref={searchRef}
            type="search"
            value={filters.search}
            onChange={(event) => onFilterChange('search', event.target.value)}
            placeholder="Ism, kompaniya, telefon, email yoki teg..."
            aria-label="Mijozlarni qidirish"
            className={styles.searchInput}
          />
          {filters.search && (
            <button
              type="button"
              className={styles.clearSearch}
              onClick={() => onFilterChange('search', '')}
              aria-label="Qidiruvni tozalash"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <select
          aria-label="Tarif bo‘yicha filtr"
          value={filters.segment}
          onChange={(event) => onFilterChange('segment', event.target.value)}
          className={styles.select}
        >
          <option value="all">Barcha tariflar</option>
          {CUSTOMER_SEGMENTS.map((segment) => (
            <option key={segment.value} value={segment.value}>
              Tarif: {segment.label}
            </option>
          ))}
        </select>

        <select
          aria-label="Operator bo‘yicha filtr"
          value={filters.operator}
          onChange={(event) => onFilterChange('operator', event.target.value)}
          className={styles.select}
        >
          <option value="all">Barcha operatorlar</option>
          {operators.map((operator) => (
            <option key={operator} value={operator}>
              {operator}
            </option>
          ))}
        </select>

        <select
          aria-label="Manba bo‘yicha filtr"
          value={filters.source}
          onChange={(event) => onFilterChange('source', event.target.value)}
          className={styles.select}
        >
          <option value="all">Barcha manbalar</option>
          {CUSTOMER_SOURCES.map((source) => (
            <option key={source.value} value={source.value}>
              Manba: {source.label}
            </option>
          ))}
        </select>

        <select
          aria-label="Saralash tartibi"
          value={filters.sortBy}
          onChange={(event) => onFilterChange('sortBy', event.target.value)}
          className={styles.select}
        >
          {CUSTOMER_SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {hasActiveFilters && (
          <Button variant="secondary" size="md" onClick={onResetFilters}>
            <RotateCcw size={14} />
            Tozalash
          </Button>
        )}
      </div>

      <div className={styles.metaRow}>
        <span className="tabular-nums">
          Natija: <strong>{filteredCount}</strong> / {totalCount} ta mijoz
        </span>
        <span className={styles.shortcutHint}>
          Tezkor qidiruv uchun <kbd className={styles.kbd}>/</kbd> tugmasini bosing
        </span>
      </div>
    </div>
  );
}
