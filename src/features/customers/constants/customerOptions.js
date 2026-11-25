export const CUSTOMER_STATUSES = [
  {
    value: 'new',
    label: 'Yangi',
    tone: 'info',
    description: 'Yangi murojaat yoki birlamchi lid',
  },
  {
    value: 'negotiation',
    label: 'Muzokarada',
    tone: 'warning',
    description: 'Demo, texnik tahlil yoki shartnoma bosqichida',
  },
  {
    value: 'active',
    label: 'Faol',
    tone: 'success',
    description: 'Amaldagi shartnoma va doimiy xizmatda',
  },
  {
    value: 'paused',
    label: 'Kutishda',
    tone: 'cyan',
    description: 'Qaror kutilmoqda yoki vaqtincha to‘xtatilgan',
  },
  {
    value: 'inactive',
    label: 'Nofaol',
    tone: 'neutral',
    description: 'Hamkorlik yakunlangan yoki arxivda',
  },
];

export const CUSTOMER_STATUS_MAP = Object.fromEntries(
  CUSTOMER_STATUSES.map((status) => [status.value, status])
);

export const CUSTOMER_SEGMENTS = [
  { value: 'enterprise', label: 'Enterprise' },
  { value: 'business', label: 'Business' },
  { value: 'pro', label: 'Pro' },
  { value: 'start', label: 'Start' },
];

export const CUSTOMER_SEGMENT_MAP = Object.fromEntries(
  CUSTOMER_SEGMENTS.map((segment) => [segment.value, segment])
);

export const CUSTOMER_SOURCES = [
  { value: 'telegram', label: 'Telegram' },
  { value: 'website', label: 'Veb-sayt' },
  { value: 'referral', label: 'Tavsiya' },
  { value: 'partner', label: 'Hamkor orqali' },
  { value: 'outbound', label: 'Sovuq qo‘ng‘iroq' },
];

export const CUSTOMER_SOURCE_MAP = Object.fromEntries(
  CUSTOMER_SOURCES.map((source) => [source.value, source])
);

export const CRM_OPERATORS = [
  'Shohruh Ermanov',
  'Aziza Karimova',
  'Jasur Toshmatov',
  'Madina Rustamova',
  'Bekzod Alimov',
];

export const HISTORY_EVENT_TYPES = {
  created: { value: 'created', label: 'Bazaga qo‘shildi', tone: 'info' },
  status_change: { value: 'status_change', label: 'Status o‘zgardi', tone: 'warning' },
  updated: { value: 'updated', label: 'Tahrirlandi', tone: 'neutral' },
  call: { value: 'call', label: 'Qo‘ng‘iroq', tone: 'success' },
  meeting: { value: 'meeting', label: 'Uchrashuv / Demo', tone: 'cyan' },
  message: { value: 'message', label: 'Xabar', tone: 'info' },
  note: { value: 'note', label: 'Izoh', tone: 'neutral' },
  deleted: { value: 'deleted', label: 'O‘chirildi', tone: 'danger' },
};

export const INTERACTION_TYPES = [
  { value: 'call', label: 'Qo‘ng‘iroq natijasi' },
  { value: 'meeting', label: 'Uchrashuv / Demo' },
  { value: 'message', label: 'Telegram / Email xabari' },
  { value: 'note', label: 'Ichki operator izohi' },
];

export const CUSTOMER_SORT_OPTIONS = [
  { value: 'updated_desc', label: 'Oxirgi faollik bo‘yicha' },
  { value: 'created_desc', label: 'Eng yangi qo‘shilganlar' },
  { value: 'name_asc', label: 'Ism bo‘yicha (A–Z)' },
  { value: 'value_desc', label: 'Qiymat: yuqoridan pastga' },
  { value: 'value_asc', label: 'Qiymat: pastdan yuqoriga' },
];
