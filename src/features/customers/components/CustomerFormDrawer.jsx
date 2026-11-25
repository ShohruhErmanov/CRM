import { useState } from 'react';
import {
  CUSTOMER_SEGMENTS,
  CUSTOMER_SOURCES,
  CUSTOMER_STATUSES,
} from '../constants/customerOptions';
import {
  Button,
  Drawer,
  Input,
  Select,
  Textarea,
} from '../../../shared/components/ui';
import styles from './CustomerFormDrawer.module.css';

const EMPTY_FORM = {
  fullName: '',
  company: '',
  role: '',
  industry: '',
  phone: '',
  email: '',
  telegram: '',
  website: '',
  status: 'new',
  segment: 'pro',
  source: 'telegram',
  operator: '',
  contractValue: '',
  tags: '',
  notes: '',
};

function mapCustomerToForm(customer) {
  if (!customer) return EMPTY_FORM;
  return {
    fullName: customer.fullName || '',
    company: customer.company || '',
    role: customer.role || '',
    industry: customer.industry || '',
    phone: customer.phone || '',
    email: customer.email || '',
    telegram: customer.telegram || '',
    website: customer.website || '',
    status: customer.status || 'new',
    segment: customer.segment || 'pro',
    source: customer.source || 'telegram',
    operator: customer.operator || '',
    contractValue:
      customer.contractValue !== undefined && customer.contractValue !== null
        ? String(customer.contractValue)
        : '',
    tags: Array.isArray(customer.tags) ? customer.tags.join(', ') : '',
    notes: customer.notes || '',
  };
}

function validateCustomerForm(values) {
  const errors = {};

  if (!values.fullName.trim()) {
    errors.fullName = 'Mijoz ism-sharifini kiriting.';
  }
  if (!values.company.trim()) {
    errors.company = 'Kompaniya nomini kiriting.';
  }

  const phoneDigits = values.phone.replace(/\D/g, '');
  if (!values.phone.trim()) {
    errors.phone = 'Telefon raqamini kiriting.';
  } else if (phoneDigits.length < 7) {
    errors.phone = 'Telefon raqami kamida 7 ta raqamdan iborat bo‘lishi kerak.';
  }

  if (values.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = 'Email manzili formati noto‘g‘ri.';
  }

  if (values.contractValue !== '' && Number(values.contractValue) < 0) {
    errors.contractValue = 'Shartnoma qiymati manfiy bo‘lishi mumkin emas.';
  }

  return errors;
}

function CustomerFormFields({ mode, initialCustomer, onSubmit }) {
  const [values, setValues] = useState(() =>
    mode === 'edit' ? mapCustomerToForm(initialCustomer) : EMPTY_FORM
  );
  const [errors, setErrors] = useState({});

  const handleChange = (field) => (event) => {
    const nextValue = event.target.value;
    setValues((prev) => ({ ...prev, [field]: nextValue }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const validationErrors = validateCustomerForm(values);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    onSubmit(values);
  };

  return (
    <form id="customer-form" className={styles.form} onSubmit={handleSubmit} noValidate>
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Asosiy ma’lumotlar</h3>
        <div className={styles.grid}>
          <Input
            label="Ism-sharif"
            required
            placeholder="Masalan: Jasurbek Alimov"
            value={values.fullName}
            onChange={handleChange('fullName')}
            error={errors.fullName}
          />
          <Input
            label="Kompaniya"
            required
            placeholder="Masalan: FinTech Solutions"
            value={values.company}
            onChange={handleChange('company')}
            error={errors.company}
          />
          <Input
            label="Lavozim"
            placeholder="Masalan: CTO / Loyiha rahbari"
            value={values.role}
            onChange={handleChange('role')}
          />
          <Input
            label="Soha / Yo‘nalish"
            placeholder="Masalan: SaaS, Fintech, E-commerce"
            value={values.industry}
            onChange={handleChange('industry')}
          />
        </div>
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Aloqa kanallari</h3>
        <div className={styles.grid}>
          <Input
            label="Telefon raqami"
            required
            type="tel"
            placeholder="+998 90 123 45 67"
            value={values.phone}
            onChange={handleChange('phone')}
            error={errors.phone}
          />
          <Input
            label="Email"
            type="email"
            placeholder="name@company.uz"
            value={values.email}
            onChange={handleChange('email')}
            error={errors.email}
          />
          <Input
            label="Telegram"
            placeholder="@username"
            value={values.telegram}
            onChange={handleChange('telegram')}
          />
          <Input
            label="Veb-sayt"
            placeholder="company.uz"
            value={values.website}
            onChange={handleChange('website')}
          />
        </div>
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>CRM va status boshqaruvi</h3>
        <div className={styles.grid}>
          <Select
            label="Status"
            value={values.status}
            onChange={handleChange('status')}
          >
            {CUSTOMER_STATUSES.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </Select>

          <Select
            label="Tarif / Segment"
            value={values.segment}
            onChange={handleChange('segment')}
          >
            {CUSTOMER_SEGMENTS.map((segment) => (
              <option key={segment.value} value={segment.value}>
                {segment.label}
              </option>
            ))}
          </Select>

          <Select
            label="Kelish manbasi"
            value={values.source}
            onChange={handleChange('source')}
          >
            {CUSTOMER_SOURCES.map((source) => (
              <option key={source.value} value={source.value}>
                {source.label}
              </option>
            ))}
          </Select>

          <Input
            label="Mas’ul operator"
            placeholder="Masalan: Azizbek"
            value={values.operator}
            onChange={handleChange('operator')}
          />

          <Input
            label="Oylik shartnoma qiymati ($)"
            type="number"
            min="0"
            placeholder="1500"
            value={values.contractValue}
            onChange={handleChange('contractValue')}
            error={errors.contractValue}
          />

          <Input
            label="Teglar"
            placeholder="API, SLA 24/7, VIP"
            helper="Vergul bilan ajrating"
            value={values.tags}
            onChange={handleChange('tags')}
          />

          <div className={styles.fullSpan}>
            <Textarea
              label="Operator izohi"
              placeholder="Mijoz talablari, texnik tafsilotlar yoki keyingi qadamlar..."
              value={values.notes}
              onChange={handleChange('notes')}
            />
          </div>
        </div>
      </section>
    </form>
  );
}

/**
 * Create / Edit slide-over drawer for Customer records.
 */
export function CustomerFormDrawer({
  isOpen,
  mode = 'create',
  initialCustomer = null,
  onClose,
  onSubmit,
}) {
  const isEdit = mode === 'edit';
  const formKey = `${mode}-${initialCustomer?.id || 'new'}`;

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      title={isEdit ? 'Mijozni tahrirlash' : 'Yangi mijoz qo‘shish'}
      subtitle={
        isEdit && initialCustomer
          ? `${initialCustomer.fullName} (${initialCustomer.id}) ma’lumotlarini yangilash`
          : 'Mijoz va IT loyiha ma’lumotlarini CRM bazasiga kiriting'
      }
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Bekor qilish
          </Button>
          <Button type="submit" form="customer-form" variant="primary">
            {isEdit ? 'O‘zgarishlarni saqlash' : 'Mijozni saqlash'}
          </Button>
        </>
      }
    >
      {isOpen && (
        <CustomerFormFields
          key={formKey}
          mode={mode}
          initialCustomer={initialCustomer}
          onSubmit={onSubmit}
        />
      )}
    </Drawer>
  );
}
