/**
 * Joins truthy class names into a single space-separated string.
 * Shared utility available to all Finora CRM modules.
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}
