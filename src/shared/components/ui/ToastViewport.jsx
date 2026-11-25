import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';
import { useToast } from '../../hooks/useToast';
import { cn } from '../../utils/cn';
import styles from './ToastViewport.module.css';

const TONE_ICONS = {
  success: CheckCircle2,
  info: Info,
  warning: AlertCircle,
  danger: AlertCircle,
};

/**
 * Renders transient feedback notifications in the bottom-right corner.
 */
export function ToastViewport() {
  const { toasts, dismissToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className={styles.viewport} role="region" aria-label="Bildirishnomalar">
      {toasts.map((toast) => {
        const Icon = TONE_ICONS[toast.tone] || Info;
        return (
          <div key={toast.id} className={cn(styles.toast, styles[toast.tone])} role="status">
            <Icon size={18} className={styles.icon} aria-hidden="true" />
            <div className={styles.content}>
              <p className={styles.title}>{toast.title}</p>
              {toast.description && <p className={styles.description}>{toast.description}</p>}
            </div>
            <button
              type="button"
              className={styles.closeBtn}
              onClick={() => dismissToast(toast.id)}
              aria-label="Bildirishnomani yopish"
            >
              <X size={15} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
