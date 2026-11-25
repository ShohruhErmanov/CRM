import { cn } from '../../utils/cn';
import styles from './Badge.module.css';

/**
 * Semantic status pill / tag used across CRM tables, cards, and timelines.
 */
export function Badge({ children, tone = 'neutral', dot = false, className }) {
  return (
    <span className={cn(styles.badge, styles[tone], className)}>
      {dot && <span className={styles.dot} aria-hidden="true" />}
      {children}
    </span>
  );
}
