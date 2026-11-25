import { CUSTOMER_STATUSES } from '../constants/customerOptions';
import { cn } from '../../../shared/utils/cn';
import { formatCurrency } from '../../../shared/utils/formatters';
import styles from './CustomerStatsBar.module.css';

/**
 * Clickable status summary strip acting as both quick metrics and instant filters.
 */
export function CustomerStatsBar({ stats, activeStatus, onSelectStatus }) {
  const items = [
    { value: 'all', label: 'Barchasi', count: stats.total },
    ...CUSTOMER_STATUSES.map((status) => ({
      value: status.value,
      label: status.label,
      count: stats[status.value] ?? 0,
    })),
  ];

  return (
    <div className={styles.bar} role="region" aria-label="Statuslar bo‘yicha taqsimot">
      <div className={styles.pills} role="tablist" aria-label="Mijoz statusi filtrlari">
        {items.map((item) => {
          const isActive = activeStatus === item.value;
          return (
            <button
              key={item.value}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={cn(styles.pill, isActive && styles.pillActive)}
              onClick={() => onSelectStatus(item.value)}
            >
              <span>{item.label}</span>
              <span className={cn(styles.count, 'tabular-nums')}>{item.count}</span>
            </button>
          );
        })}
      </div>

      <div className={styles.portfolio}>
        <span>Faol shartnomalar:</span>
        <span className={cn(styles.portfolioValue, 'tabular-nums')}>
          {formatCurrency(stats.totalActiveValue)} / oy
        </span>
      </div>
    </div>
  );
}
