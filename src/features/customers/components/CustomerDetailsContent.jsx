import { useState } from 'react';
import {
  Briefcase,
  Building2,
  Calendar,
  Copy,
  Globe,
  History,
  Mail,
  MessageCircle,
  Pencil,
  Phone,
  Plus,
  Send,
  Tag,
  Trash2,
  UserCheck,
} from 'lucide-react';
import {
  CUSTOMER_SEGMENT_MAP,
  CUSTOMER_SOURCE_MAP,
  CUSTOMER_STATUS_MAP,
  INTERACTION_TYPES,
} from '../constants/customerOptions';
import {
  Avatar,
  Badge,
  Button,
  Input,
  Select,
  Textarea,
} from '../../../shared/components/ui';
import { cn } from '../../../shared/utils/cn';
import {
  formatCurrency,
  formatDate,
  formatDateTime,
} from '../../../shared/utils/formatters';
import { CustomerHistoryTimeline } from './CustomerHistoryTimeline';
import { StatusSelect } from './StatusSelect';
import styles from './CustomerDetailsContent.module.css';

/**
 * Shared Customer Details view rendered in both the slide-over Drawer
 * and the full-page `/customers/:id` route.
 */
export function CustomerDetailsContent({
  customer,
  onEdit,
  onDelete,
  onStatusChange,
  onAddActivity,
  onCopyValue,
  extraHeaderAction = null,
}) {
  const [activeTab, setActiveTab] = useState('overview');
  const [activityType, setActivityType] = useState('call');
  const [activityTitle, setActivityTitle] = useState('');
  const [activityDetail, setActivityDetail] = useState('');
  const [activityError, setActivityError] = useState('');

  if (!customer) return null;

  const statusMeta = CUSTOMER_STATUS_MAP[customer.status];
  const segmentLabel = CUSTOMER_SEGMENT_MAP[customer.segment]?.label || customer.segment;
  const sourceLabel = CUSTOMER_SOURCE_MAP[customer.source]?.label || customer.source;

  const handleLogSubmit = (event) => {
    event.preventDefault();
    if (!activityTitle.trim() && !activityDetail.trim()) {
      setActivityError('Harakat sarlavhasi yoki izohni kiriting.');
      return;
    }

    const defaultTitle =
      INTERACTION_TYPES.find((item) => item.value === activityType)?.label ||
      'Operator harakati';

    onAddActivity(customer.id, {
      type: activityType,
      title: activityTitle.trim() || defaultTitle,
      detail: activityDetail.trim(),
    });

    setActivityTitle('');
    setActivityDetail('');
    setActivityError('');
  };

  return (
    <div className={styles.container}>
      <div className={styles.heroCard}>
        <div className={styles.heroTop}>
          <div className={styles.identity}>
            <Avatar name={customer.fullName} size="lg" />
            <div>
              <div className={styles.nameRow}>
                <h3 className={styles.name}>{customer.fullName}</h3>
                <span className={cn(styles.idPill, 'tabular-nums')}>{customer.id}</span>
              </div>
              <p className={styles.companyMeta}>
                {customer.company}
                {customer.role ? ` · ${customer.role}` : ''}
                {customer.industry ? ` · ${customer.industry}` : ''}
              </p>
            </div>
          </div>

          <div className={styles.heroActions}>
            {extraHeaderAction}
            <Button variant="secondary" size="sm" onClick={() => onEdit(customer)}>
              <Pencil size={14} />
              Tahrirlash
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => onDelete(customer)}
              aria-label="Mijozni o‘chirish"
            >
              <Trash2 size={14} />
              O‘chirish
            </Button>
          </div>
        </div>

        <div className={styles.statusBar}>
          <div>
            <span className={styles.statusHint}>
              Joriy holat: <strong>{statusMeta?.description}</strong>
            </span>
          </div>
          <StatusSelect
            value={customer.status}
            customerName={customer.fullName}
            onChange={(nextStatus) => onStatusChange(customer.id, nextStatus)}
          />
        </div>
      </div>

      <div className={styles.tabs} role="tablist" aria-label="Mijoz tafsiloti bo‘limlari">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'overview'}
          className={cn(styles.tabBtn, activeTab === 'overview' && styles.tabBtnActive)}
          onClick={() => setActiveTab('overview')}
        >
          Umumiy ma’lumot
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'history'}
          className={cn(styles.tabBtn, activeTab === 'history' && styles.tabBtnActive)}
          onClick={() => setActiveTab('history')}
        >
          <History size={15} aria-hidden="true" />
          Mijoz tarixi
          <span className={cn(styles.tabCount, 'tabular-nums')}>
            {customer.history?.length || 0}
          </span>
        </button>
      </div>

      {activeTab === 'overview' ? (
        <>
          <div className={styles.infoGrid}>
            <div className={styles.infoBox}>
              <span className={styles.infoLabel}>
                <Phone size={13} aria-hidden="true" /> Telefon
              </span>
              <div className={styles.infoValueRow}>
                <span className={cn(styles.infoValue, 'tabular-nums')}>{customer.phone}</span>
                <button
                  type="button"
                  className={styles.inlineCopy}
                  onClick={() => onCopyValue(customer.phone, 'Telefon raqami')}
                  aria-label="Telefon raqamini nusxalash"
                >
                  <Copy size={14} />
                </button>
              </div>
            </div>

            <div className={styles.infoBox}>
              <span className={styles.infoLabel}>
                <Mail size={13} aria-hidden="true" /> Email
              </span>
              <div className={styles.infoValueRow}>
                <span className={styles.infoValue}>{customer.email || 'Kiritilmagan'}</span>
                {customer.email && (
                  <button
                    type="button"
                    className={styles.inlineCopy}
                    onClick={() => onCopyValue(customer.email, 'Email manzili')}
                    aria-label="Emailni nusxalash"
                  >
                    <Copy size={14} />
                  </button>
                )}
              </div>
            </div>

            <div className={styles.infoBox}>
              <span className={styles.infoLabel}>
                <MessageCircle size={13} aria-hidden="true" /> Telegram
              </span>
              <span className={styles.infoValue}>{customer.telegram || '—'}</span>
            </div>

            <div className={styles.infoBox}>
              <span className={styles.infoLabel}>
                <Globe size={13} aria-hidden="true" /> Veb-sayt
              </span>
              <span className={styles.infoValue}>{customer.website || '—'}</span>
            </div>

            <div className={styles.infoBox}>
              <span className={styles.infoLabel}>
                <Briefcase size={13} aria-hidden="true" /> Tarif va Shartnoma
              </span>
              <span className={cn(styles.infoValue, 'tabular-nums')}>
                {segmentLabel} · {formatCurrency(customer.contractValue)} / oy
              </span>
            </div>

            <div className={styles.infoBox}>
              <span className={styles.infoLabel}>
                <UserCheck size={13} aria-hidden="true" /> Mas’ul operator va Manba
              </span>
              <span className={styles.infoValue}>
                {customer.operator} · {sourceLabel}
              </span>
            </div>

            <div className={styles.infoBox}>
              <span className={styles.infoLabel}>
                <Calendar size={13} aria-hidden="true" /> Bazaga qo‘shilgan
              </span>
              <span className={cn(styles.infoValue, 'tabular-nums')}>
                {formatDate(customer.createdAt)}
              </span>
            </div>

            <div className={styles.infoBox}>
              <span className={styles.infoLabel}>
                <Building2 size={13} aria-hidden="true" /> Oxirgi aloqa
              </span>
              <span className={cn(styles.infoValue, 'tabular-nums')}>
                {formatDateTime(customer.lastContactAt)}
              </span>
            </div>
          </div>

          <div className={styles.sectionBox}>
            <h4 className={styles.sectionHeading}>Operator izohi</h4>
            <p className={styles.notesText}>
              {customer.notes || 'Bu mijoz uchun hali qo‘shimcha izoh kiritilmagan.'}
            </p>
          </div>

          {customer.tags && customer.tags.length > 0 && (
            <div className={styles.sectionBox}>
              <h4 className={styles.sectionHeading}>
                <Tag size={13} style={{ verticalAlign: 'middle', marginRight: '0.35rem' }} />
                Teglar
              </h4>
              <div className={styles.tagsRow}>
                {customer.tags.map((tag) => (
                  <Badge key={tag} tone="neutral">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <form className={styles.activityComposer} onSubmit={handleLogSubmit}>
            <h4 className={styles.sectionHeading}>
              <Plus size={14} style={{ verticalAlign: 'middle', marginRight: '0.35rem' }} />
              Tezkor aloqa yoki izoh qo‘shish
            </h4>
            <div className={styles.composerRow}>
              <Select
                label="Harakat turi"
                value={activityType}
                onChange={(event) => setActivityType(event.target.value)}
              >
                {INTERACTION_TYPES.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </Select>
              <Input
                label="Qisqa sarlavha"
                placeholder="Masalan: Demo bo‘yicha qayta qo‘ng‘iroq"
                value={activityTitle}
                onChange={(event) => {
                  setActivityTitle(event.target.value);
                  if (activityError) setActivityError('');
                }}
              />
            </div>
            <Textarea
              label="Tafsilotlar"
              placeholder="Suhbat natijasi yoki keyingi kelishuvni yozib qo‘ying..."
              value={activityDetail}
              onChange={(event) => {
                setActivityDetail(event.target.value);
                if (activityError) setActivityError('');
              }}
              error={activityError}
            />
            <div className={styles.composerFooter}>
              <Button type="submit" variant="primary" size="sm">
                <Send size={14} />
                Tarixga saqlash
              </Button>
            </div>
          </form>
        </>
      ) : (
        <>
          <form className={styles.activityComposer} onSubmit={handleLogSubmit}>
            <h4 className={styles.sectionHeading}>Tarixga yangi yozuv qo‘shish</h4>
            <div className={styles.composerRow}>
              <Select
                label="Turi"
                value={activityType}
                onChange={(event) => setActivityType(event.target.value)}
              >
                {INTERACTION_TYPES.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </Select>
              <Input
                label="Sarlavha"
                placeholder="Masalan: Shartnoma shartlari kelishildi"
                value={activityTitle}
                onChange={(event) => {
                  setActivityTitle(event.target.value);
                  if (activityError) setActivityError('');
                }}
              />
            </div>
            <Textarea
              label="Izoh"
              placeholder="Muloqot tafsiloti..."
              value={activityDetail}
              onChange={(event) => {
                setActivityDetail(event.target.value);
                if (activityError) setActivityError('');
              }}
              error={activityError}
            />
            <div className={styles.composerFooter}>
              <Button type="submit" variant="primary" size="sm">
                <Send size={14} />
                Yozuv qo‘shish
              </Button>
            </div>
          </form>

          <CustomerHistoryTimeline events={customer.history || []} />
        </>
      )}
    </div>
  );
}
