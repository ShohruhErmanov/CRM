import { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { CUSTOMER_STATUS_MAP, CUSTOMER_STATUSES } from '../constants/customerOptions';
import { cn } from '../../../shared/utils/cn';
import styles from './StatusSelect.module.css';

const DOT_CLASS_BY_TONE = {
  info: styles.dotInfo,
  success: styles.dotSuccess,
  warning: styles.dotWarning,
  cyan: styles.dotCyan,
  neutral: styles.dotNeutral,
};

/**
 * Floating inline status switcher used in table rows and customer detail headers.
 * Uses fixed coordinates so dropdown menus are never clipped by table scroll containers.
 */
export function StatusSelect({ value, onChange, customerName = '' }) {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const triggerRef = useRef(null);
  const menuRef = useRef(null);

  const current = CUSTOMER_STATUS_MAP[value] || CUSTOMER_STATUSES[0];

  useEffect(() => {
    if (!open) return undefined;

    const updatePosition = () => {
      const rect = triggerRef.current?.getBoundingClientRect();
      if (!rect) return;

      const menuWidth = 248;
      const estimatedMenuHeight = 290;
      const spaceBelow = window.innerHeight - rect.bottom;
      const top =
        spaceBelow < estimatedMenuHeight && rect.top > estimatedMenuHeight
          ? rect.top - estimatedMenuHeight - 6
          : rect.bottom + 6;
      const left = Math.min(
        Math.max(12, rect.left),
        window.innerWidth - menuWidth - 12
      );

      setCoords({ top, left });
    };

    updatePosition();

    const handleOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };

    window.addEventListener('mousedown', handleOutside);
    window.addEventListener('keydown', handleEscape);
    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);

    return () => {
      window.removeEventListener('mousedown', handleOutside);
      window.removeEventListener('keydown', handleEscape);
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [open]);

  return (
    <div
      className={styles.wrap}
      onClick={(event) => event.stopPropagation()}
    >
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={
          customerName
            ? `${customerName} statusini o'zgartirish: ${current.label}`
            : `Status: ${current.label}`
        }
        className={cn(styles.trigger, styles[current.tone])}
        onClick={() => setOpen((prev) => !prev)}
      >
        <span className={styles.dot} aria-hidden="true" />
        <span>{current.label}</span>
        <ChevronDown size={13} aria-hidden="true" />
      </button>

      {open && (
        <div
          ref={menuRef}
          role="listbox"
          aria-label="Mijoz statusini tanlash"
          className={styles.menu}
          style={{ top: `${coords.top}px`, left: `${coords.left}px` }}
        >
          <span className={styles.menuTitle}>Statusni tanlang</span>
          {CUSTOMER_STATUSES.map((status) => {
            const isSelected = status.value === value;
            return (
              <button
                key={status.value}
                type="button"
                role="option"
                aria-selected={isSelected}
                className={cn(styles.option, isSelected && styles.optionActive)}
                onClick={() => {
                  if (status.value !== value) {
                    onChange(status.value);
                  }
                  setOpen(false);
                }}
              >
                <span className={styles.optionMain}>
                  <span
                    className={cn(styles.optionDot, DOT_CLASS_BY_TONE[status.tone])}
                    aria-hidden="true"
                  />
                  <span>
                    <span className={styles.optionLabel}>{status.label}</span>
                    <span className={styles.optionDesc}>{status.description}</span>
                  </span>
                </span>
                {isSelected && <Check size={15} className={styles.checkIcon} aria-hidden="true" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
