const CUSTOMERS_STORAGE_KEY = 'finora_crm_customers_v2';
const ARCHIVED_HISTORY_STORAGE_KEY = 'finora_crm_customers_history_archive_v2';

const LEGACY_KEYS = [
  'finora_crm_customers_v1',
  'finora_crm_customers_history_archive_v1',
];

function clearLegacyKeys() {
  try {
    LEGACY_KEYS.forEach((key) => window.localStorage.removeItem(key));
  } catch {
    // Ignore storage access errors in restricted environments
  }
}

/**
 * Customer repository service.
 * Starts cleanly with 0 records and persists user-created customers in localStorage.
 * Teammates can swap these methods to REST / GraphQL endpoints without changing UI components.
 */
export function loadCustomers() {
  clearLegacyKeys();
  try {
    const raw = window.localStorage.getItem(CUSTOMERS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveCustomers(customers) {
  try {
    window.localStorage.setItem(CUSTOMERS_STORAGE_KEY, JSON.stringify(customers));
  } catch {
    // Keep in-memory state working even if storage quota is exceeded
  }
}

export function loadArchivedHistory() {
  try {
    const raw = window.localStorage.getItem(ARCHIVED_HISTORY_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveArchivedHistory(events) {
  try {
    window.localStorage.setItem(ARCHIVED_HISTORY_STORAGE_KEY, JSON.stringify(events));
  } catch {
    // Ignore storage write restrictions gracefully
  }
}

export function resetCustomerStorage() {
  clearLegacyKeys();
  saveCustomers([]);
  saveArchivedHistory([]);
  return [];
}
