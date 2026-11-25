import { useState } from 'react';
import { ArrowLeft, UserX } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { CUSTOMER_STATUS_MAP } from '../constants/customerOptions';
import { CustomerDetailsContent } from '../components/CustomerDetailsContent';
import { CustomerFormDrawer } from '../components/CustomerFormDrawer';
import { DeleteCustomerDialog } from '../components/DeleteCustomerDialog';
import { useCustomersContext } from '../context/useCustomersContext';
import { Button, EmptyState } from '../../../shared/components/ui';
import { useToast } from '../../../shared/hooks/useToast';
import styles from './CustomerDetailPage.module.css';

/**
 * Dedicated full-page Customer Details route (`/customers/:id`) so teammates' modules
 * (Deals, Tasks, Reports) can deep-link directly to any customer.
 */
export function CustomerDetailPage() {
  const { customerId } = useParams();
  const navigate = useNavigate();
  const {
    customers,
    updateCustomer,
    changeCustomerStatus,
    addCustomerActivity,
    deleteCustomer,
  } = useCustomersContext();
  const { showToast } = useToast();

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const customer = customers.find((item) => item.id === customerId) || null;

  const handleEditSubmit = (values) => {
    if (!customer) return;
    updateCustomer(customer.id, values);
    setEditOpen(false);
    showToast({
      tone: 'success',
      title: 'Mijoz yangilandi',
      description: `${values.fullName} ma’lumotlari saqlandi.`,
    });
  };

  const handleStatusChange = (id, nextStatus) => {
    changeCustomerStatus(id, nextStatus);
    const label = CUSTOMER_STATUS_MAP[nextStatus]?.label || nextStatus;
    showToast({
      tone: 'info',
      title: 'Status o‘zgartirildi',
      description: `Yangi holat: ${label}`,
    });
  };

  const handleAddActivity = (id, activity) => {
    addCustomerActivity(id, activity);
    showToast({
      tone: 'success',
      title: 'Tarixga yozuv qo‘shildi',
      description: activity.title,
    });
  };

  const handleConfirmDelete = (id) => {
    const removed = deleteCustomer(id);
    setDeleteOpen(false);
    if (removed) {
      showToast({
        tone: 'warning',
        title: 'Mijoz o‘chirildi',
        description: `${removed.fullName} ro‘yxatdan olib tashlandi.`,
      });
    }
    navigate('/customers');
  };

  const handleCopyValue = async (text, label) => {
    try {
      await navigator.clipboard.writeText(text);
      showToast({
        tone: 'info',
        title: `${label} nusxalandi`,
        description: text,
        duration: 2200,
      });
    } catch {
      showToast({
        tone: 'warning',
        title: 'Nusxalab bo‘lmadi',
        description: text,
      });
    }
  };

  return (
    <section className={styles.page}>
      <div className={styles.backRow}>
        <Link to="/customers">
          <Button variant="secondary" size="sm">
            <ArrowLeft size={15} />
            Mijozlar ro‘yxatiga qaytish
          </Button>
        </Link>
      </div>

      {!customer ? (
        <EmptyState
          icon={<UserX size={22} />}
          title="Mijoz topilmadi"
          description={`"${customerId}" identifikatorli mijoz mavjud emas yoki bazadan o‘chirilgan.`}
          action={
            <Link to="/customers">
              <Button variant="primary">Mijozlar bazasiga qaytish</Button>
            </Link>
          }
        />
      ) : (
        <div className={styles.surface}>
          <CustomerDetailsContent
            customer={customer}
            onEdit={() => setEditOpen(true)}
            onDelete={() => setDeleteOpen(true)}
            onStatusChange={handleStatusChange}
            onAddActivity={handleAddActivity}
            onCopyValue={handleCopyValue}
          />
        </div>
      )}

      <CustomerFormDrawer
        isOpen={editOpen}
        mode="edit"
        initialCustomer={customer}
        onClose={() => setEditOpen(false)}
        onSubmit={handleEditSubmit}
      />

      <DeleteCustomerDialog
        customer={deleteOpen ? customer : null}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteOpen(false)}
      />
    </section>
  );
}
