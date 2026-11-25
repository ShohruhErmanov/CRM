import { useEffect, useState } from 'react';

/**
 * Debounces a rapidly changing value (e.g. search query) by delayMs.
 */
export function useDebouncedValue(value, delayMs = 200) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedValue(value);
    }, delayMs);

    return () => window.clearTimeout(timer);
  }, [value, delayMs]);

  return debouncedValue;
}
