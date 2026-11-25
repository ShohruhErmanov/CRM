import { badRequest } from '../utils/app-error.js'
import { assertNoUnknownFields, booleanField, idField, personName, textField } from './common.validator.js'

const allowedFields = [
  'firstName', 'lastName', 'phone', 'email', 'departmentId', 'positionId',
  'hireDate', 'salary', 'removePhoto',
]

export function normalizePhone(value) {
  const digits = String(value ?? '').replace(/[\s()-]/g, '')
  const match = /^(?:\+998|998|0)([1-9]\d{8})$/.exec(digits)
  if (!match) {
    throw badRequest('Telefon raqami noto‘g‘ri formatda.', [
      { field: 'Telefon raqami', message: 'Misol: +998901234567.' },
    ])
  }
  return `+998${match[1]}`
}

function validateEmail(value) {
  const email = textField(value, 'Elektron pochta', { min: 5, max: 120 }).toLowerCase()
  if (!/^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(email)) {
    throw badRequest('Elektron pochta manzili noto‘g‘ri.', [
      { field: 'Elektron pochta', message: 'Misol: ism@example.uz.' },
    ])
  }
  return email
}

function validateHireDate(value) {
  const date = textField(value, 'Ishga kirgan sana', { min: 10, max: 10 })
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(Date.parse(`${date}T00:00:00Z`))) {
    throw badRequest('Ishga kirgan sana noto‘g‘ri.', [
      { field: 'Ishga kirgan sana', message: 'Sana YYYY-MM-DD shaklida bo‘lishi kerak.' },
    ])
  }
  if (Date.parse(`${date}T00:00:00Z`) > Date.now() + 86400000) {
    throw badRequest('Ishga kirgan sana kelajakda bo‘lishi mumkin emas.', [
      { field: 'Ishga kirgan sana', message: 'Bugungi yoki o‘tgan sanani tanlang.' },
    ])
  }
  return date
}

function validateSalary(value) {
  const raw = typeof value === 'number' ? String(value) : textField(value, 'Maosh', { min: 1, max: 15 })
  if (!/^\d+$/.test(raw)) {
    throw badRequest('Maosh faqat butun son bo‘lishi kerak.', [
      { field: 'Maosh', message: 'Faqat raqam kiriting.' },
    ])
  }
  const salary = Number(raw)
  if (!Number.isSafeInteger(salary) || salary > 1000000000000) {
    throw badRequest('Maosh qiymati juda katta.', [
      { field: 'Maosh', message: 'To‘g‘ri qiymat kiriting.' },
    ])
  }
  return salary
}

export function validateEmployeePayload(body) {
  assertNoUnknownFields(body, allowedFields)

  return {
    firstName: personName(body.firstName, 'Ism'),
    lastName: personName(body.lastName, 'Familiya'),
    phone: normalizePhone(body.phone),
    email: validateEmail(body.email),
    departmentId: idField(body.departmentId, 'Bo‘lim'),
    positionId: idField(body.positionId, 'Lavozim'),
    hireDate: validateHireDate(body.hireDate),
    salary: validateSalary(body.salary),
    removePhoto: booleanField(body.removePhoto),
  }
}

export function validateStatus(value) {
  if (value !== 'active' && value !== 'blocked') {
    throw badRequest('Holat noto‘g‘ri.', [
      { field: 'Holat', message: 'Faqat faol yoki bloklangan bo‘lishi mumkin.' },
    ])
  }
  return value
}
