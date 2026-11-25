const moneyFormatter = new Intl.NumberFormat('uz-UZ')
const dateFormatter = new Intl.DateTimeFormat('uz-UZ', {
  day: '2-digit', month: '2-digit', year: 'numeric',
})
const dateTimeFormatter = new Intl.DateTimeFormat('uz-UZ', {
  day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
})
const monthFormatter = new Intl.DateTimeFormat('uz-UZ', { month: 'short' })
const longDateFormatter = new Intl.DateTimeFormat('uz-UZ', {
  day: 'numeric', month: 'long', year: 'numeric', weekday: 'long',
})

export function formatMoney(value) {
  return `${moneyFormatter.format(Number(value || 0))} so‘m`
}

export function formatNumber(value) {
  return moneyFormatter.format(Number(value || 0))
}

export function formatDate(value) {
  if (!value) return '—'
  const date = new Date(String(value).length === 10 ? `${value}T00:00:00Z` : value)
  if (Number.isNaN(date.getTime())) return '—'
  return dateFormatter.format(date)
}

export function formatDateTime(value) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return dateTimeFormatter.format(date)
}

export function formatToday() {
  return longDateFormatter.format(new Date())
}

export function monthLabel(month) {
  const [year, number] = String(month).split('-').map(Number)
  if (!year || !number) return month
  return `${monthFormatter.format(new Date(Date.UTC(year, number - 1, 1)))}, ${year}`
}

export function shortMonthLabel(month) {
  const [year, number] = String(month).split('-').map(Number)
  if (!year || !number) return month
  const label = monthFormatter.format(new Date(Date.UTC(year, number - 1, 1)))
  return `${label} ${String(number).padStart(2, '0')}`
}

export function initials(firstName, lastName) {
  return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase()
}

export function photoUrl(photoPath) {
  return photoPath || null
}
