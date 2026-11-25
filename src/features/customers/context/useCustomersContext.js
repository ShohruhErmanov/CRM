import { createContext, useContext } from 'react';

export const CustomersContext = createContext(null);

export function useCustomersContext() {
  const context = useContext(CustomersContext);
  if (!context) {
    throw new Error('useCustomersContext must be used within CustomersProvider');
  }
  return context;
}
