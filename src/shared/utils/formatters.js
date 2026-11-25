const MONTHS_UZ = [
  'yan',
  'fev',
  'mar',
  'apr',
  'may',
  'iyn',
  'iyl',
  'avg',
  'sen',
  'okt',
  'noy',
  'dek',
];

/**
 * Formats an ISO date string into a readable Uzbek short date (e.g. "18 noy, 2026").
 */
export function formatDate(isoString) {
  if (!isoString) return '—';
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return '—';

  const day = date.getDate();
  const month = MONTHS_UZ[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${month}, ${year}`;
}

/**
 * Formats an ISO date string with time (e.g. "18 noy, 14:30").
 */
export function formatDateTime(isoString) {
  if (!isoString) return '—';
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return '—';

  const day = date.getDate();
  const month = MONTHS_UZ[date.getMonth()];
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${day} ${month}, ${hours}:${minutes}`;
}

/**
 * Formats relative time in natural Uzbek for operator activity feeds.
 */
export function formatRelativeTime(isoString) {
  if (!isoString) return '—';
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return '—';

  const diffMs = Date.now() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);

  if (diffMin < 1) return 'Hozirgina';
  if (diffMin < 60) return `${diffMin} daq oldin`;

  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours} soat oldin`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return 'Kecha';
  if (diffDays < 7) return `${diffDays} kun oldin`;

  return formatDate(isoString);
}

/**
 * Formats contract / LTV amount cleanly (USD or UZS).
 */
export function formatCurrency(amount, currency = 'USD') {
  const numeric = Number(amount);
  if (Number.isNaN(numeric) || amount === '' || amount === null || amount === undefined) {
    return '—';
  }

  if (currency === 'UZS') {
    return `${new Intl.NumberFormat('uz-UZ').format(numeric)} so'm`;
  }

  return `$${new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0,
  }).format(numeric)}`;
}

/**
 * Extracts up to 2 uppercase initials from a full name or company name.
 */
export function getInitials(name = '') {
  const parts = String(name).trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'FM';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}
