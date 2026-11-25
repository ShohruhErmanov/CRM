import { BrowserRouter } from 'react-router-dom';
import { CustomersProvider } from '../features/customers';
import { ToastViewport } from '../shared/components/ui';
import { ToastProvider } from '../shared/hooks/ToastProvider';
import { AppRouter } from './router';

export function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <CustomersProvider>
          <AppRouter />
          <ToastViewport />
        </CustomersProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
