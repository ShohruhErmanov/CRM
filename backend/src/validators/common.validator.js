import { badRequest } from '../utils/app-error.js'

export function textField(value, label, options = {}) {
  const { min = 1, max = 120, required = true, allowEmpty = false } = options
  if ((value === undefined || value === null || value === '') && !required) return ''

  if (typeof value !== 'string') {
    throw badRequest(`${label} matn shaklida bo‘lishi kerak.`, [{ field: label, message: 'Noto‘g‘ri qiymat.' }])
  }

  const trimmed = value.trim()
  if (!trimmed && !allowEmpty) {
    throw badRequest(`${label} to‘ldirilishi shart.`, [{ field: label, message: 'Majburiy maydon.' }])
  }
  if (trimmed.length < min) {
    throw badRequest(`${label} kamida ${min} belgidan iborat bo‘lishi kerak.`, [
      { field: label, message: `Kamida ${min} belgi kiriting.` },
    ])
  }
  if (trimmed.length > max) {
    throw badRequest(`${label} eng ko‘p ${max} belgidan iborat bo‘lishi kerak.`, [
      { field: label, message: `Eng ko‘p ${max} belgi kiriting.` },
    ])
  }
  return trimmed
}

export function personName(value, label) {
  const name = textField(value, label, { min: 2, max: 60 })
  const letters = name.replace(/[\s‘’'-]/gu, '')
  if (!/^\p{L}+$/u.test(letters) || letters.length < 2) {
    throw badRequest(`${label} faqat harflardan iborat bo‘lishi kerak.`, [
      { field: label, message: 'Faqat harflar, bo‘shliq, tire va apostrofdan foydalaning.' },
    ])
  }
  return name
}

export function idField(value, label) {
  const numeric = typeof value === 'number' ? value : Number(value)
  if (!Number.isInteger(numeric) || numeric <= 0) {
    throw badRequest(`${label} noto‘g‘ri tanlangan.`, [
      { field: label, message: 'Ro‘yxatdan qiymat tanlang.' },
    ])
  }
  return numeric
}

export function validateIdParam(value, label = 'Identifikator') {
  return idField(value, label)
}

export function booleanField(value) {
  return value === true || value === 'true' || value === 1 || value === '1'
}

export function assertNoUnknownFields(body, allowed) {
  const unknown = Object.keys(body || {}).filter((key) => !allowed.includes(key))
  if (unknown.length) {
    throw badRequest('Noto‘g‘ri maydonlar yuborildi.', [
      { field: unknown.join(', '), message: 'Bu maydonlar qabul qilinmaydi.' },
    ])
  }
}
