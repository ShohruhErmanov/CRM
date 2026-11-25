/**
 * Public entry point of the Finora CRM Customers feature module.
 * Other modules and the router should import only from this barrel file.
 */
export { CustomersProvider } from './context/CustomersContext';
export { useCustomersContext } from './context/useCustomersContext';
export { CustomersPage } from './pages/CustomersPage';
export { CustomerDetailPage } from './pages/CustomerDetailPage';
export {
  CUSTOMER_STATUSES,
  CUSTOMER_STATUS_MAP,
  CUSTOMER_SEGMENTS,
  CUSTOMER_SOURCES,
} from './constants/customerOptions';
