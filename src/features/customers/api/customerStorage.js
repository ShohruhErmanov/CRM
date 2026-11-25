import { SEED_CUSTOMERS } from '../data/seedCustomers';

const CUSTOMERS_STORAGE_KEY = 'finora_crm_customers_v1';
const ARCHIVED_HISTORY_STORAGE_KEY = 'finora_crm_customers_history_archive_v1';

function cloneSeedCustomers() {
  return JSON.parse(JSON.stringify(SEED_CUSTOMERS));
}

/**
 * Customer repository service.
 * Currently backed by localStorage; teammates or backend engineers can swap
 * these methods to REST / GraphQL API calls without changing UI components.
 */
export function loadCustomers() {
  try {
    const raw = window.localStorage.getItem(CUSTOMERS_STORAGE_KEY);
    if (!raw) {
      const initial = cloneSeedCustomers();
      saveCustomers(initial);
      return initial;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : cloneSeedCustomers();
  } catch {
    return cloneSeedCustomers();
  }
}

export function saveCustomers(customers) {
  try {
    window.localStorage.setItem(CUSTOMERS_STORAGE_KEY, JSON.stringify(customers));
  } catch {
    // Storage quota or private browsing mode fallback: keep in-memory state working
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
  const fresh = cloneSeedCustomers();
  saveCustomers(fresh);
  saveArchivedHistory([]);
  return fresh;
}
