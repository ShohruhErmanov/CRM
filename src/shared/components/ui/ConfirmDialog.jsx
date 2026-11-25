import { useEffect, useId, useRef } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from './Button';
import styles from './ConfirmDialog.module.css';

/**
 * Confirmation modal reserved strictly for irreversible / destructive actions.
 */
export function ConfirmDialog({
  isOpen,
  title,
  description,
  confirmLabel = "O'chirish",
  cancelLabel = 'Bekor qilish',
  onConfirm,
  onCancel,
}) {
  const titleId = useId();
  const cancelRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return undefined;

    const timer = window.setTimeout(() => {
      cancelRef.current?.focus();
    }, 10);

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onCancel();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      className={styles.backdrop}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onCancel();
        }
      }}
    >
      <div role="alertdialog" aria-modal="true" aria-labelledby={titleId} className={styles.dialog}>
        <div className={styles.header}>
          <div className={styles.iconWrap} aria-hidden="true">
            <AlertTriangle size={20} />
          </div>
          <div>
            <h3 id={titleId} className={styles.title}>
              {title}
            </h3>
            <p className={styles.description}>{description}</p>
          </div>
        </div>

        <div className={styles.actions}>
          <Button ref={cancelRef} variant="secondary" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button variant="danger" onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
