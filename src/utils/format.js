const numberFormatter = new Intl.NumberFormat('uz-UZ')

const months = [
  'Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun',
  'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr',
]
const shortMonths = ['Yan', 'Fev', 'Mar', 'Apr', 'May', 'Iyun', 'Iyul', 'Avg', 'Sen', 'Okt', 'Noy', 'Dek']
const weekdays = ['Yakshanba', 'Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba']

const pad = (value) => String(value).padStart(2, '0')

export function formatMoney(value) {
  return `${numberFormatter.format(Number(value || 0))} so‘m`
}

export function formatNumber(value) {
  return numberFormatter.format(Number(value || 0))
}

export function formatDate(value) {
  if (!value) return '—'
  const date = new Date(String(value).length === 10 ? `${value}T00:00:00Z` : value)
  if (Number.isNaN(date.getTime())) return '—'
  return `${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${date.getFullYear()}`
}

export function formatDateTime(value) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return `${date.getDate()} ${shortMonths[date.getMonth()]} ${date.getFullYear()}, ${pad(date.getHours())}:${pad(date.getMinutes())}`
}

export function formatToday() {
  const date = new Date()
  return `${weekdays[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`
}

export function monthLabel(month) {
  const [year, number] = String(month).split('-').map(Number)
  if (!year || !number || !months[number - 1]) return month
  return `${months[number - 1]} ${year}`
}

export function shortMonthLabel(month) {
  const [year, number] = String(month).split('-').map(Number)
  if (!year || !number || !shortMonths[number - 1]) return month
  return `${shortMonths[number - 1]} ${pad(number)}`
}

export function initials(firstName, lastName) {
  return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase()
}

export function photoUrl(photoPath) {
  return photoPath || null
}
