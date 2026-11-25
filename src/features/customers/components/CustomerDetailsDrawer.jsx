import { ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button, Drawer } from '../../../shared/components/ui';
import { CustomerDetailsContent } from './CustomerDetailsContent';

/**
 * Slide-over Customer Details drawer keeping operators inside the customer list context.
 */
export function CustomerDetailsDrawer({
  customer,
  onClose,
  onEdit,
  onDelete,
  onStatusChange,
  onAddActivity,
  onCopyValue,
}) {
  return (
    <Drawer
      isOpen={Boolean(customer)}
      onClose={onClose}
      size="lg"
      title={customer ? `${customer.fullName} — Mijoz tafsilotlari` : 'Mijoz tafsilotlari'}
      subtitle={customer ? `${customer.company} · ${customer.id}` : ''}
    >
      <CustomerDetailsContent
        customer={customer}
        onEdit={onEdit}
        onDelete={onDelete}
        onStatusChange={onStatusChange}
        onAddActivity={onAddActivity}
        onCopyValue={onCopyValue}
        extraHeaderAction={
          customer ? (
            <Link to={`/customers/${customer.id}`} onClick={onClose}>
              <Button variant="ghost" size="sm">
                <ExternalLink size={14} />
                To‘liq sahifa
              </Button>
            </Link>
          ) : null
        }
      />
    </Drawer>
  );
}
