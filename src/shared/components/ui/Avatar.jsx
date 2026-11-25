import { cn } from '../../utils/cn';
import { getInitials } from '../../utils/formatters';
import styles from './Avatar.module.css';

const TONES = ['blue', 'emerald', 'sky', 'amber', 'slate'];

function getToneForName(name = '') {
  let hash = 0;
  for (let i = 0; i < name.length; i += 1) {
    hash = (hash * 31 + name.charCodeAt(i)) % TONES.length;
  }
  return TONES[Math.abs(hash) % TONES.length];
}

/**
 * Deterministic initials avatar tuned for dark surfaces.
 */
export function Avatar({ name, size = 'md', className }) {
  const tone = getToneForName(name);
  return (
    <span
      className={cn(styles.avatar, styles[size], styles[tone], className)}
      aria-hidden="true"
    >
      {getInitials(name)}
    </span>
  );
}
