import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  loadArchivedHistory,
  loadCustomers,
  resetCustomerStorage,
  saveArchivedHistory,
  saveCustomers,
} from '../api/customerStorage';
import {
  CUSTOMER_SEGMENT_MAP,
  CUSTOMER_SOURCE_MAP,
  CUSTOMER_STATUS_MAP,
} from '../constants/customerOptions';
import { useDebouncedValue } from '../../../shared/hooks/useDebouncedValue';

export const DEFAULT_FILTERS = {
  search: '',
  status: 'all',
  segment: 'all',
  operator: 'all',
  source: 'all',
  sortBy: 'updated_desc',
};

function createEvent({
  type,
  title,
  detail = '',
  actor = 'Operator',
  fromStatus,
  toStatus,
}) {
  return {
    id: `evt-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    type,
    title,
    detail,
    actor,
    ...(fromStatus ? { fromStatus } : {}),
    ...(toStatus ? { toStatus } : {}),
    createdAt: new Date().toISOString(),
  };
}

function generateCustomerId(customers) {
  const maxNum = customers.reduce((max, item) => {
    const numeric = Number.parseInt(String(item.id).replace(/\D/g, ''), 10);
    return Number.isNaN(numeric) ? max : Math.max(max, numeric);
  }, 1000);
  return `CUS-${maxNum + 1}`;
}

function parseTags(rawTags) {
  if (Array.isArray(rawTags)) return rawTags;
  return String(rawTags || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

/**
 * Core state & business logic hook for Finora CRM Customer Database.
 */
export function useCustomers() {
  const [customers, setCustomers] = useState(() => loadCustomers());
  const [archivedHistory, setArchivedHistory] = useState(() => loadArchivedHistory());
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  const debouncedSearch = useDebouncedValue(filters.search, 160);

  useEffect(() => {
    saveCustomers(customers);
  }, [customers]);

  useEffect(() => {
    saveArchivedHistory(archivedHistory);
  }, [archivedHistory]);

  const updateFilter = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  const createCustomer = useCallback(
    (payload) => {
      const nowIso = new Date().toISOString();
      const id = generateCustomerId(customers);
      const status = payload.status || 'new';
      const operator = (payload.operator || '').trim() || 'Operator';
      const sourceLabel =
        CUSTOMER_SOURCE_MAP[payload.source]?.label || 'To‘g‘ridan-to‘g‘ri';

      const initialEvent = createEvent({
        type: 'created',
        title: 'Mijoz bazaga qo‘shildi',
        detail: `${sourceLabel} manbasi orqali "${CUSTOMER_STATUS_MAP[status]?.label || status}" statusida ro‘yxatga olindi.`,
        actor: operator,
      });

      const createdCustomer = {
        id,
        fullName: payload.fullName.trim(),
        company: payload.company.trim(),
        role: (payload.role || '').trim(),
        industry: (payload.industry || '').trim(),
        phone: payload.phone.trim(),
        email: (payload.email || '').trim(),
        telegram: (payload.telegram || '').trim(),
        website: (payload.website || '').trim(),
        status,
        segment: payload.segment || 'pro',
        source: payload.source || 'telegram',
        operator,
        contractValue: Number(payload.contractValue) || 0,
        tags: parseTags(payload.tags),
        notes: (payload.notes || '').trim(),
        createdAt: nowIso,
        updatedAt: nowIso,
        lastContactAt: nowIso,
        history: [initialEvent],
      };

      setCustomers((prev) => [createdCustomer, ...prev]);
      return createdCustomer;
    },
    [customers]
  );

  const updateCustomer = useCallback(
    (id, payload) => {
      const existing = customers.find((item) => item.id === id);
      if (!existing) return null;

      const nowIso = new Date().toISOString();
      const changes = [];
      const nextTags = parseTags(payload.tags);
      const nextValue = Number(payload.contractValue) || 0;

      if (payload.fullName.trim() !== existing.fullName) {
        changes.push(`Ism: "${existing.fullName}" → "${payload.fullName.trim()}"`);
      }
      if (payload.company.trim() !== existing.company) {
        changes.push(`Kompaniya: "${existing.company}" → "${payload.company.trim()}"`);
      }
      if (payload.phone.trim() !== existing.phone) {
        changes.push('Telefon yangilandi');
      }
      if ((payload.email || '').trim() !== (existing.email || '')) {
        changes.push('Email yangilandi');
      }
      if (payload.segment !== existing.segment) {
        const oldSeg = CUSTOMER_SEGMENT_MAP[existing.segment]?.label || existing.segment;
        const newSeg = CUSTOMER_SEGMENT_MAP[payload.segment]?.label || payload.segment;
        changes.push(`Tarif: ${oldSeg} → ${newSeg}`);
      }
      const nextOperator = (payload.operator || '').trim() || 'Operator';
      if (nextOperator !== existing.operator) {
        changes.push(`Operator: ${existing.operator} → ${nextOperator}`);
      }
      if (nextValue !== Number(existing.contractValue || 0)) {
        changes.push(`Shartnoma qiymati: $${existing.contractValue || 0} → $${nextValue}`);
      }

      const newEvents = [];
      if (payload.status !== existing.status) {
        newEvents.push(
          createEvent({
            type: 'status_change',
            title: 'Status o‘zgartirildi',
            detail: 'Tahrirlash oynasi orqali status yangilandi.',
            fromStatus: existing.status,
            toStatus: payload.status,
            actor: nextOperator,
          })
        );
      }

      if (changes.length > 0) {
        newEvents.push(
          createEvent({
            type: 'updated',
            title: 'Mijoz ma’lumotlari tahrirlandi',
            detail: changes.join(' · '),
            actor: nextOperator,
          })
        );
      } else if (newEvents.length === 0) {
        newEvents.push(
          createEvent({
            type: 'updated',
            title: 'Profil qayta saqlandi',
            detail: 'Izohlar yoki qo‘shimcha maydonlar yangilandi.',
            actor: nextOperator,
          })
        );
      }

      const updatedRecord = {
        ...existing,
        fullName: payload.fullName.trim(),
        company: payload.company.trim(),
        role: (payload.role || '').trim(),
        industry: (payload.industry || '').trim(),
        phone: payload.phone.trim(),
        email: (payload.email || '').trim(),
        telegram: (payload.telegram || '').trim(),
        website: (payload.website || '').trim(),
        status: payload.status,
        segment: payload.segment,
        source: payload.source,
        operator: nextOperator,
        contractValue: nextValue,
        tags: nextTags,
        notes: (payload.notes || '').trim(),
        updatedAt: nowIso,
        history: [...newEvents, ...(existing.history || [])],
      };

      setCustomers((prev) =>
        prev.map((customer) => (customer.id === id ? updatedRecord : customer))
      );

      return updatedRecord;
    },
    [customers]
  );

  const changeCustomerStatus = useCallback((id, nextStatus, note = '') => {
    const nowIso = new Date().toISOString();
    setCustomers((prev) =>
      prev.map((customer) => {
        if (customer.id !== id || customer.status === nextStatus) return customer;

        const statusEvent = createEvent({
          type: 'status_change',
          title: 'Status o‘zgartirildi',
          detail: note.trim() || 'Operator tomonidan status yangilandi.',
          fromStatus: customer.status,
          toStatus: nextStatus,
          actor: customer.operator || 'Operator',
        });

        return {
          ...customer,
          status: nextStatus,
          updatedAt: nowIso,
          lastContactAt: nowIso,
          history: [statusEvent, ...(customer.history || [])],
        };
      })
    );
  }, []);

  const addCustomerActivity = useCallback((id, { type = 'note', title, detail }) => {
    const nowIso = new Date().toISOString();
    setCustomers((prev) =>
      prev.map((customer) => {
        if (customer.id !== id) return customer;

        const activityEvent = createEvent({
          type,
          title: title.trim(),
          detail: detail.trim(),
          actor: customer.operator || 'Operator',
        });

        return {
          ...customer,
          updatedAt: nowIso,
          lastContactAt: nowIso,
          history: [activityEvent, ...(customer.history || [])],
        };
      })
    );
  }, []);

  const deleteCustomer = useCallback(
    (id) => {
      const target = customers.find((item) => item.id === id);
      if (!target) return null;

      setCustomers((prev) => prev.filter((item) => item.id !== id));

      const deletedLog = {
        ...createEvent({
          type: 'deleted',
          title: 'Mijoz bazadan o‘chirildi',
          detail: `${target.fullName} (${target.company}) yozuvi o‘chirildi.`,
          actor: target.operator || 'Operator',
        }),
        customerId: target.id,
        customerName: target.fullName,
        company: target.company,
        customerDeleted: true,
      };

      setArchivedHistory((prev) => [deletedLog, ...prev]);
      return target;
    },
    [customers]
  );

  const clearAllCustomers = useCallback(() => {
    const fresh = resetCustomerStorage();
    setCustomers(fresh);
    setArchivedHistory([]);
    setFilters(DEFAULT_FILTERS);
  }, []);

  const filteredCustomers = useMemo(() => {
    const query = debouncedSearch.trim().toLowerCase();

    const matched = customers.filter((customer) => {
      if (filters.status !== 'all' && customer.status !== filters.status) {
        return false;
      }
      if (filters.segment !== 'all' && customer.segment !== filters.segment) {
        return false;
      }
      if (filters.operator !== 'all' && customer.operator !== filters.operator) {
        return false;
      }
      if (filters.source !== 'all' && customer.source !== filters.source) {
        return false;
      }

      if (!query) return true;

      const haystack = [
        customer.id,
        customer.fullName,
        customer.company,
        customer.role,
        customer.industry,
        customer.phone,
        customer.email,
        customer.telegram,
        customer.operator,
        customer.notes,
        ...(customer.tags || []),
      ]
        .join(' ')
        .toLowerCase();

      return haystack.includes(query);
    });

    const sorted = [...matched];
    sorted.sort((a, b) => {
      switch (filters.sortBy) {
        case 'created_desc':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'name_asc':
          return a.fullName.localeCompare(b.fullName, 'uz');
        case 'value_desc':
          return (b.contractValue || 0) - (a.contractValue || 0);
        case 'value_asc':
          return (a.contractValue || 0) - (b.contractValue || 0);
        case 'updated_desc':
        default:
          return new Date(b.updatedAt) - new Date(a.updatedAt);
      }
    });

    return sorted;
  }, [customers, debouncedSearch, filters]);

  const stats = useMemo(() => {
    const counts = {
      total: customers.length,
      new: 0,
      negotiation: 0,
      active: 0,
      paused: 0,
      inactive: 0,
      totalActiveValue: 0,
    };

    customers.forEach((customer) => {
      if (counts[customer.status] !== undefined) {
        counts[customer.status] += 1;
      }
      if (customer.status === 'active') {
        counts.totalActiveValue += Number(customer.contractValue) || 0;
      }
    });

    return counts;
  }, [customers]);

  const globalHistory = useMemo(() => {
    const activeEvents = customers.flatMap((customer) =>
      (customer.history || []).map((event) => ({
        ...event,
        customerId: customer.id,
        customerName: customer.fullName,
        company: customer.company,
        customerDeleted: false,
      }))
    );

    return [...activeEvents, ...archivedHistory].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  }, [customers, archivedHistory]);

  const operators = useMemo(
    () =>
      Array.from(
        new Set(customers.map((item) => item.operator).filter(Boolean))
      ).sort((a, b) => a.localeCompare(b, 'uz')),
    [customers]
  );

  return {
    customers,
    filteredCustomers,
    operators,
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
    clearAllCustomers,
  };
}
