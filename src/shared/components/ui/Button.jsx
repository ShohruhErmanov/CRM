import { cn } from '../../utils/cn';
import styles from './Button.module.css';

/**
 * Standard interactive button primitive for Finora CRM.
 */
export function Button({
  children,
  variant = 'primary',
  size = 'md',
  iconOnly = false,
  type = 'button',
  className,
  ...props
}) {
  return (
    <button
      type={type}
      className={cn(
        styles.btn,
        styles[variant],
        styles[size],
        iconOnly && styles.iconOnly,
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
