import { useState } from 'react';
import { History, Plus, RotateCcw, Users } from 'lucide-react';
import { CUSTOMER_STATUS_MAP } from '../constants/customerOptions';
import { CustomerDetailsDrawer } from '../components/CustomerDetailsDrawer';
import { CustomerFormDrawer } from '../components/CustomerFormDrawer';
import { CustomerHistoryTimeline } from '../components/CustomerHistoryTimeline';
import { CustomerStatsBar } from '../components/CustomerStatsBar';
import { CustomerTable } from '../components/CustomerTable';
import { CustomerToolbar } from '../components/CustomerToolbar';
import { DeleteCustomerDialog } from '../components/DeleteCustomerDialog';
import { useCustomersContext } from '../context/useCustomersContext';
import { Button } from '../../../shared/components/ui';
import { useToast } from '../../../shared/hooks/useToast';
import { cn } from '../../../shared/utils/cn';
import styles from './CustomersPage.module.css';

/**
 * Main Customer Database view for Finora CRM.
 * Supports customer directory, search & filters, CRUD, status management,
 * customer details drawer, and global history log.
 */
export function CustomersPage() {
  const {
    customers,
    filteredCustomers,
    stats,
    globalHistory,
    filters,
    updateFilter,
    resetFilters,
    createCustomer,
    updateCustomer,
    changeCustomerStatus,
    addCustomerActivity,
    deleteCustomer,
    resetDemoData,
  } = useCustomersContext();

  const { showToast } = useToast();

  const [activeView, setActiveView] = useState('list');
  const [formState, setFormState] = useState({ open: false, mode: 'create', customer: null });
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const selectedCustomer =
    customers.find((item) => item.id === selectedCustomerId) || null;

  const hasActiveFilters =
    filters.search.trim() !== '' ||
    filters.status !== 'all' ||
    filters.segment !== 'all' ||
    filters.operator !== 'all' ||
    filters.source !== 'all';

  const handleOpenCreate = () => {
    setFormState({ open: true, mode: 'create', customer: null });
  };

  const handleOpenEdit = (customer) => {
    setFormState({ open: true, mode: 'edit', customer });
  };

  const handleFormSubmit = (values) => {
    if (formState.mode === 'edit' && formState.customer) {
      updateCustomer(formState.customer.id, values);
      showToast({
        tone: 'success',
        title: 'Mijoz yangilandi',
        description: `${values.fullName} ma’lumotlari saqlandi.`,
      });
    } else {
      const created = createCustomer(values);
      showToast({
        tone: 'success',
        title: 'Yangi mijoz qo‘shildi',
        description: `${created.fullName} (${created.company}) bazaga kiritildi.`,
      });
    }
    setFormState({ open: false, mode: 'create', customer: null });
  };

  const handleStatusChange = (id, nextStatus) => {
    const target = customers.find((item) => item.id === id);
    changeCustomerStatus(id, nextStatus);
    const statusLabel = CUSTOMER_STATUS_MAP[nextStatus]?.label || nextStatus;
    showToast({
      tone: 'info',
      title: 'Status o‘zgartirildi',
      description: target
        ? `${target.fullName} → ${statusLabel}`
        : `Yangi status: ${statusLabel}`,
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
    if (selectedCustomerId === id) {
      setSelectedCustomerId(null);
    }
    setDeleteTarget(null);
    if (removed) {
      showToast({
        tone: 'warning',
        title: 'Mijoz o‘chirildi',
        description: `${removed.fullName} ro‘yxatdan olib tashlandi.`,
      });
    }
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

  const handleResetDemo = () => {
    resetDemoData();
    setSelectedCustomerId(null);
    showToast({
      tone: 'info',
      title: 'Demo ma’lumotlar tiklandi',
      description: 'Boshlang‘ich IT mijozlar bazasi qayta yuklandi.',
    });
  };

  return (
    <section className={styles.page}>
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <h1 className={styles.title}>Mijozlar bazasi</h1>
          <p className={styles.subtitle}>
            IT kompaniyalar, aloqa tafsilotlari, statuslar va operator tarixini yagona oynada boshqaring.
          </p>
        </div>

        <div className={styles.headerActions}>
          <Button variant="ghost" size="md" onClick={handleResetDemo}>
            <RotateCcw size={15} />
            Namuna bazani tiklash
          </Button>
          <Button variant="primary" size="md" onClick={handleOpenCreate}>
            <Plus size={16} />
            Mijoz qo‘shish
          </Button>
        </div>
      </div>

      <div className={styles.viewSwitch} role="tablist" aria-label="Bo‘lim ko‘rinishi">
        <button
          type="button"
          role="tab"
          aria-selected={activeView === 'list'}
          className={cn(styles.viewTab, activeView === 'list' && styles.viewTabActive)}
          onClick={() => setActiveView('list')}
        >
          <Users size={15} aria-hidden="true" />
          <span>Mijozlar ro‘yxati</span>
          <span className={cn(styles.viewBadge, 'tabular-nums')}>{customers.length}</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeView === 'history'}
          className={cn(styles.viewTab, activeView === 'history' && styles.viewTabActive)}
          onClick={() => setActiveView('history')}
        >
          <History size={15} aria-hidden="true" />
          <span>Mijozlar tarixi</span>
          <span className={cn(styles.viewBadge, 'tabular-nums')}>
            {globalHistory.length}
          </span>
        </button>
      </div>

      {activeView === 'list' ? (
        <>
          <CustomerStatsBar
            stats={stats}
            activeStatus={filters.status}
            onSelectStatus={(status) => updateFilter('status', status)}
          />

          <CustomerToolbar
            filters={filters}
            onFilterChange={updateFilter}
            onResetFilters={resetFilters}
            totalCount={customers.length}
            filteredCount={filteredCustomers.length}
          />

          <CustomerTable
            customers={filteredCustomers}
            selectedCustomerId={selectedCustomerId}
            hasFilters={hasActiveFilters}
            onSelectCustomer={(customer) => setSelectedCustomerId(customer.id)}
            onEditCustomer={handleOpenEdit}
            onDeleteCustomer={(customer) => setDeleteTarget(customer)}
            onStatusChange={handleStatusChange}
            onCopyValue={handleCopyValue}
            onCreateCustomer={handleOpenCreate}
            onResetFilters={resetFilters}
          />
        </>
      ) : (
        <div className={styles.historySurface}>
          <div className={styles.historyHeader}>
            <div>
              <h2 className={styles.historyTitle}>Barcha mijozlar tarixi</h2>
              <p className={styles.historySubtitle}>
                Status o‘zgarishlari, tahrirlar, qo‘ng‘iroqlar va operator izohlarining umumiy xronologiyasi.
              </p>
            </div>
          </div>

          <CustomerHistoryTimeline
            events={globalHistory}
            showCustomerName
            onSelectCustomer={(customerId) => setSelectedCustomerId(customerId)}
          />
        </div>
      )}

      <CustomerFormDrawer
        isOpen={formState.open}
        mode={formState.mode}
        initialCustomer={formState.customer}
        onClose={() => setFormState({ open: false, mode: 'create', customer: null })}
        onSubmit={handleFormSubmit}
      />

      <CustomerDetailsDrawer
        customer={selectedCustomer}
        onClose={() => setSelectedCustomerId(null)}
        onEdit={handleOpenEdit}
        onDelete={(customer) => setDeleteTarget(customer)}
        onStatusChange={handleStatusChange}
        onAddActivity={handleAddActivity}
        onCopyValue={handleCopyValue}
      />

      <DeleteCustomerDialog
        customer={deleteTarget}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </section>
  );
}
