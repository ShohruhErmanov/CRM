import { useMemo, useState } from 'react';
import {
  ArrowRight,
  History,
  MessageSquare,
  Pencil,
  Phone,
  RefreshCw,
  StickyNote,
  Trash2,
  UserPlus,
  Video,
} from 'lucide-react';
import {
  CUSTOMER_STATUS_MAP,
  HISTORY_EVENT_TYPES,
} from '../constants/customerOptions';
import { Badge, EmptyState } from '../../../shared/components/ui';
import { cn } from '../../../shared/utils/cn';
import { formatDateTime, formatRelativeTime } from '../../../shared/utils/formatters';
import styles from './CustomerHistoryTimeline.module.css';

const EVENT_ICONS = {
  created: UserPlus,
  status_change: RefreshCw,
  updated: Pencil,
  call: Phone,
  meeting: Video,
  message: MessageSquare,
  note: StickyNote,
  deleted: Trash2,
};

const TONE_CLASSES = {
  info: styles.toneInfo,
  success: styles.toneSuccess,
  warning: styles.toneWarning,
  cyan: styles.toneCyan,
  danger: styles.toneDanger,
  neutral: '',
};

const FILTER_OPTIONS = [
  { value: 'all', label: 'Barcha harakatlar' },
  { value: 'status_change', label: 'Statuslar' },
  { value: 'call', label: 'Qo‘ng‘iroqlar' },
  { value: 'meeting', label: 'Uchrashuvlar' },
  { value: 'message', label: 'Xabarlar' },
  { value: 'updated', label: 'Tahrirlar' },
  { value: 'note', label: 'Izohlar' },
];

/**
 * Chronological customer activity and audit log used in both per-customer details
 * and the global customer history view.
 */
export function CustomerHistoryTimeline({
  events = [],
  showCustomerName = false,
  onSelectCustomer = null,
}) {
  const [typeFilter, setTypeFilter] = useState('all');

  const filteredEvents = useMemo(() => {
    if (typeFilter === 'all') return events;
    return events.filter((event) => event.type === typeFilter);
  }, [events, typeFilter]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.filterRow} role="group" aria-label="Tarix turini filtrlash">
        {FILTER_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            className={cn(
              styles.filterBtn,
              typeFilter === option.value && styles.filterBtnActive
            )}
            onClick={() => setTypeFilter(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>

      {events.length === 0 ? (
        <EmptyState
          icon={<History size={22} />}
          title="Hozircha mijozlar tarixi bo‘sh"
          description="Mijoz qo‘shilganida, status o‘zgarganda yoki qo‘ng‘iroq/izoh kiritilganda barcha harakatlar shu yerda saqlanadi."
        />
      ) : filteredEvents.length === 0 ? (
        <EmptyState
          icon={<History size={22} />}
          title="Bu turdagi tarix yozuvlari topilmadi"
          description="Boshqa harakat turini tanlang yoki mijoz kartochkasiga yangi qo‘ng‘iroq/izoh qo‘shing."
        />
      ) : (
        <ol className={styles.timeline}>
          {filteredEvents.map((event) => {
            const eventMeta = HISTORY_EVENT_TYPES[event.type] || HISTORY_EVENT_TYPES.note;
            const Icon = EVENT_ICONS[event.type] || StickyNote;
            const fromMeta = event.fromStatus ? CUSTOMER_STATUS_MAP[event.fromStatus] : null;
            const toMeta = event.toStatus ? CUSTOMER_STATUS_MAP[event.toStatus] : null;

            return (
              <li key={event.id} className={styles.item}>
                <div className={styles.rail} aria-hidden="true">
                  <span className={cn(styles.iconCircle, TONE_CLASSES[eventMeta.tone])}>
                    <Icon size={14} />
                  </span>
                  <span className={styles.railLine} />
                </div>

                <div className={styles.card}>
                  <div className={styles.cardTop}>
                    <div className={styles.titleBlock}>
                      <h4 className={styles.eventTitle}>{event.title}</h4>
                      {showCustomerName && event.customerName && (
                        <button
                          type="button"
                          disabled={event.customerDeleted || !onSelectCustomer}
                          className={cn(
                            styles.customerLink,
                            event.customerDeleted && styles.customerDeleted
                          )}
                          onClick={() => {
                            if (!event.customerDeleted && onSelectCustomer) {
                              onSelectCustomer(event.customerId);
                            }
                          }}
                        >
                          <span>
                            {event.customerName}
                            {event.company ? ` · ${event.company}` : ''}
                            {event.customerDeleted ? ' (o‘chirilgan)' : ''}
                          </span>
                        </button>
                      )}
                    </div>

                    <time
                      dateTime={event.createdAt}
                      title={formatDateTime(event.createdAt)}
                      className={cn(styles.time, 'tabular-nums')}
                    >
                      {formatRelativeTime(event.createdAt)}
                    </time>
                  </div>

                  {fromMeta && toMeta && (
                    <div className={styles.statusShift}>
                      <Badge tone={fromMeta.tone} dot>
                        {fromMeta.label}
                      </Badge>
                      <ArrowRight size={13} color="#94A3B8" aria-hidden="true" />
                      <Badge tone={toMeta.tone} dot>
                        {toMeta.label}
                      </Badge>
                    </div>
                  )}

                  {event.detail && <p className={styles.detail}>{event.detail}</p>}

                  <div className={styles.meta}>
                    <span>Operator: {event.actor || 'Tizim'}</span>
                    <span className="tabular-nums">{formatDateTime(event.createdAt)}</span>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}
