import { useId } from 'react';
import { cn } from '../../utils/cn';
import styles from './Field.module.css';

/**
 * Text input field with label, optional leading icon, helper, and error feedback.
 */
export function Input({
  label,
  error,
  helper,
  required = false,
  leadingIcon,
  id: providedId,
  className,
  ...props
}) {
  const generatedId = useId();
  const id = providedId || generatedId;

  return (
    <div className={cn(styles.field, className)}>
      {label && (
        <div className={styles.labelRow}>
          <label htmlFor={id} className={styles.label}>
            {label}
            {required && <span className={styles.required} aria-hidden="true">*</span>}
          </label>
        </div>
      )}
      <div className={styles.controlWrap}>
        {leadingIcon && <span className={styles.leadingIcon}>{leadingIcon}</span>}
        <input
          id={id}
          aria-invalid={Boolean(error)}
          className={cn(
            styles.control,
            styles.inputControl,
            leadingIcon && styles.withIcon,
            error && styles.hasError
          )}
          {...props}
        />
      </div>
      {error ? (
        <span className={styles.error} role="alert">{error}</span>
      ) : helper ? (
        <span className={styles.helper}>{helper}</span>
      ) : null}
    </div>
  );
}

/**
 * Select dropdown field following Finora input grammar.
 */
export function Select({
  label,
  error,
  helper,
  required = false,
  id: providedId,
  className,
  children,
  ...props
}) {
  const generatedId = useId();
  const id = providedId || generatedId;

  return (
    <div className={cn(styles.field, className)}>
      {label && (
        <div className={styles.labelRow}>
          <label htmlFor={id} className={styles.label}>
            {label}
            {required && <span className={styles.required} aria-hidden="true">*</span>}
          </label>
        </div>
      )}
      <select
        id={id}
        aria-invalid={Boolean(error)}
        className={cn(
          styles.control,
          styles.selectControl,
          error && styles.hasError
        )}
        {...props}
      >
        {children}
      </select>
      {error ? (
        <span className={styles.error} role="alert">{error}</span>
      ) : helper ? (
        <span className={styles.helper}>{helper}</span>
      ) : null}
    </div>
  );
}

/**
 * Multiline textarea field for notes and history logs.
 */
export function Textarea({
  label,
  error,
  helper,
  required = false,
  id: providedId,
  className,
  ...props
}) {
  const generatedId = useId();
  const id = providedId || generatedId;

  return (
    <div className={cn(styles.field, className)}>
      {label && (
        <div className={styles.labelRow}>
          <label htmlFor={id} className={styles.label}>
            {label}
            {required && <span className={styles.required} aria-hidden="true">*</span>}
          </label>
        </div>
      )}
      <textarea
        id={id}
        aria-invalid={Boolean(error)}
        className={cn(
          styles.control,
          styles.textareaControl,
          error && styles.hasError
        )}
        {...props}
      />
      {error ? (
        <span className={styles.error} role="alert">{error}</span>
      ) : helper ? (
        <span className={styles.helper}>{helper}</span>
      ) : null}
    </div>
  );
}
