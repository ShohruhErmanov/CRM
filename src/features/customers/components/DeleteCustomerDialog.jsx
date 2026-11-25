import { ConfirmDialog } from '../../../shared/components/ui';

/**
 * Confirmation modal shown before permanently removing a customer record.
 */
export function DeleteCustomerDialog({ customer, onConfirm, onCancel }) {
  return (
    <ConfirmDialog
      isOpen={Boolean(customer)}
      title="Mijozni o‘chirishni tasdiqlaysizmi?"
      description={
        customer
          ? `${customer.fullName} (${customer.company}) mijozlar ro‘yxatidan butunlay o‘chiriladi. O‘chirish haqidagi yozuv umumiy tarixda saqlanib qoladi.`
          : ''
      }
      confirmLabel="Ha, o‘chirish"
      cancelLabel="Bekor qilish"
      onConfirm={() => customer && onConfirm(customer.id)}
      onCancel={onCancel}
    />
  );
}
