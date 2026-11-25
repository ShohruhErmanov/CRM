import { Navigate, Route, Routes } from 'react-router-dom';
import {
  CustomerDetailPage,
  CustomersPage,
  useCustomersContext,
} from '../features/customers';
import { CrmLayout } from '../layouts/CrmLayout';
import { ModulePlaceholder } from '../layouts/ModulePlaceholder';
import { CRM_NAV_ITEMS } from './navigation';

/**
 * Central route configuration for Finora CRM.
 * Teammates replace `<ModulePlaceholder />` with their feature page components
 * as each module is completed.
 */
export function AppRouter() {
  const { customers } = useCustomersContext();
  const placeholderModules = CRM_NAV_ITEMS.filter((item) => !item.ready);

  return (
    <Routes>
      <Route element={<CrmLayout customerCount={customers.length} />}>
        <Route index element={<Navigate to="/customers" replace />} />
        <Route path="/customers" element={<CustomersPage />} />
        <Route path="/customers/:customerId" element={<CustomerDetailPage />} />

        {placeholderModules.map((moduleItem) => (
          <Route
            key={moduleItem.id}
            path={moduleItem.path}
            element={<ModulePlaceholder module={moduleItem} />}
          />
        ))}

        <Route path="*" element={<Navigate to="/customers" replace />} />
      </Route>
    </Routes>
  );
}
