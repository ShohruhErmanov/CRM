import { Copy, Eye, Pencil, Plus, RotateCcw, Trash2, Users } from 'lucide-react';
import {
  CUSTOMER_SEGMENT_MAP,
  CUSTOMER_SOURCE_MAP,
} from '../constants/customerOptions';
import { Avatar, Button, EmptyState } from '../../../shared/components/ui';
import { cn } from '../../../shared/utils/cn';
import { formatCurrency, formatRelativeTime } from '../../../shared/utils/formatters';
import { StatusSelect } from './StatusSelect';
import styles from './CustomerTable.module.css';

/**
 * High-density customer list supporting desktop tabular scanning and mobile cards.
 */
export function CustomerTable({
  customers,
  selectedCustomerId = null,
  hasFilters = false,
  onSelectCustomer,
  onEditCustomer,
  onDeleteCustomer,
  onStatusChange,
  onCopyValue,
  onCreateCustomer,
  onResetFilters,
}) {
  if (customers.length === 0) {
    return (
      <EmptyState
        icon={<Users size={22} />}
        title={
          hasFilters
            ? 'Filtrlar bo‘yicha mijoz topilmadi'
            : 'Hozircha mijozlar bazasi bo‘sh'
        }
        description={
          hasFilters
            ? 'Qidiruv so‘rovi yoki tanlangan status, tarif va operator filtrlarini o‘zgartirib ko‘ring.'
            : 'Birinchi mijozingizni qo‘shing va ularning statusi hamda aloqa tarixini kuzatib boring.'
        }
        action={
          <>
            {hasFilters && (
              <Button variant="secondary" onClick={onResetFilters}>
                <RotateCcw size={15} />
                Filtrlarni tozalash
              </Button>
            )}
            <Button variant="primary" onClick={onCreateCustomer}>
              <Plus size={16} />
              Mijoz qo‘shish
            </Button>
          </>
        }
      />
    );
  }

  return (
    <div className={styles.surface}>
      <div className={styles.tableScroll}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Mijoz va Kompaniya</th>
              <th>Aloqa</th>
              <th>Status</th>
              <th>Tarif va Manba</th>
              <th>Mas’ul operator</th>
              <th>Qiymat / Aloqa</th>
              <th style={{ textAlign: 'right' }}>Amallar</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => {
              const segmentLabel =
                CUSTOMER_SEGMENT_MAP[customer.segment]?.label || customer.segment;
              const sourceLabel =
                CUSTOMER_SOURCE_MAP[customer.source]?.label || customer.source;
              const isSelected = customer.id === selectedCustomerId;

              return (
                <tr
                  key={customer.id}
                  className={cn(styles.row, isSelected && styles.rowSelected)}
                  onClick={() => onSelectCustomer(customer)}
                >
                  <td>
                    <div className={styles.identityCell}>
                      <Avatar name={customer.fullName} size="md" />
                      <div className={styles.identityText}>
                        <p className={styles.customerName}>
                          <button
                            type="button"
                            className={styles.nameTrigger}
                            onClick={(event) => {
                              event.stopPropagation();
                              onSelectCustomer(customer);
                            }}
                          >
                            {customer.fullName}
                          </button>
                          <span className={cn(styles.customerId, 'tabular-nums')}>
                            {customer.id}
                          </span>
                        </p>
                        <p className={styles.companyLine}>
                          {customer.company}
                          {customer.role ? ` · ${customer.role}` : ''}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td>
                    <div className={styles.contactStack}>
                      <div className={styles.contactRow}>
                        <span className={cn(styles.phone, 'tabular-nums')}>
                          {customer.phone}
                        </span>
                        <button
                          type="button"
                          className={styles.copyBtn}
                          aria-label={`${customer.fullName} telefon raqamini nusxalash`}
                          title="Telefon raqamini nusxalash"
                          onClick={(event) => {
                            event.stopPropagation();
                            onCopyValue(customer.phone, 'Telefon raqami');
                          }}
                        >
                          <Copy size={13} />
                        </button>
                      </div>
                      {customer.email && (
                        <span className={styles.email}>{customer.email}</span>
                      )}
                    </div>
                  </td>

                  <td>
                    <StatusSelect
                      value={customer.status}
                      customerName={customer.fullName}
                      onChange={(nextStatus) => onStatusChange(customer.id, nextStatus)}
                    />
                  </td>

                  <td>
                    <span className={styles.segmentLabel}>{segmentLabel}</span>
                    <span className={styles.sourceLabel}>{sourceLabel}</span>
                  </td>

                  <td>
                    <span className={styles.operatorName}>{customer.operator}</span>
                  </td>

                  <td>
                    <span className={cn(styles.valueAmount, 'tabular-nums')}>
                      {formatCurrency(customer.contractValue)}
                    </span>
                    <span className={cn(styles.lastContact, 'tabular-nums')}>
                      {formatRelativeTime(customer.lastContactAt)}
                    </span>
                  </td>

                  <td onClick={(event) => event.stopPropagation()}>
                    <div className={styles.actionsCell}>
                      <button
                        type="button"
                        className={styles.actionBtn}
                        aria-label={`${customer.fullName} tafsilotlarini ko'rish`}
                        title="Tafsilotlarni ko‘rish"
                        onClick={() => onSelectCustomer(customer)}
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        type="button"
                        className={styles.actionBtn}
                        aria-label={`${customer.fullName} ma'lumotlarini tahrirlash`}
                        title="Tahrirlash"
                        onClick={() => onEditCustomer(customer)}
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        type="button"
                        className={cn(styles.actionBtn, styles.actionDanger)}
                        aria-label={`${customer.fullName}ni o'chirish`}
                        title="O‘chirish"
                        onClick={() => onDeleteCustomer(customer)}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Responsive Mobile List */}
      <div className={styles.mobileList}>
        {customers.map((customer) => {
          const segmentLabel =
            CUSTOMER_SEGMENT_MAP[customer.segment]?.label || customer.segment;
          return (
            <div
              key={customer.id}
              className={styles.mobileCard}
              onClick={() => onSelectCustomer(customer)}
            >
              <div className={styles.mobileTop}>
                <div className={styles.identityCell}>
                  <Avatar name={customer.fullName} size="md" />
                  <div className={styles.identityText}>
                    <p className={styles.customerName}>{customer.fullName}</p>
                    <p className={styles.companyLine}>{customer.company}</p>
                  </div>
                </div>
                <StatusSelect
                  value={customer.status}
                  customerName={customer.fullName}
                  onChange={(nextStatus) => onStatusChange(customer.id, nextStatus)}
                />
              </div>

              <div className={styles.mobileGrid}>
                <div>
                  <span className={styles.mobileLabel}>Telefon</span>
                  <span className="tabular-nums">{customer.phone}</span>
                </div>
                <div>
                  <span className={styles.mobileLabel}>Qiymat / Tarif</span>
                  <span className="tabular-nums">
                    {formatCurrency(customer.contractValue)} · {segmentLabel}
                  </span>
                </div>
                <div>
                  <span className={styles.mobileLabel}>Operator</span>
                  <span>{customer.operator}</span>
                </div>
                <div>
                  <span className={styles.mobileLabel}>Oxirgi aloqa</span>
                  <span className="tabular-nums">
                    {formatRelativeTime(customer.lastContactAt)}
                  </span>
                </div>
              </div>

              <div
                className={styles.mobileFooter}
                onClick={(event) => event.stopPropagation()}
              >
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => onSelectCustomer(customer)}
                >
                  <Eye size={14} />
                  Tafsilotlar
                </Button>
                <div className={styles.actionsCell}>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEditCustomer(customer)}
                  >
                    <Pencil size={14} />
                    Tahrirlash
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    iconOnly
                    aria-label={`${customer.fullName}ni o'chirish`}
                    onClick={() => onDeleteCustomer(customer)}
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
