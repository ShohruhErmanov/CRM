import { useCustomers } from '../hooks/useCustomers';
import { CustomersContext } from './useCustomersContext';

/**
 * Provides shared customer state across the Customer module and other CRM modules
 * (e.g. sidebar count, Deals, Tasks).
 */
export function CustomersProvider({ children }) {
  const value = useCustomers();
  return (
    <CustomersContext.Provider value={value}>
      {children}
    </CustomersContext.Provider>
  );
}
