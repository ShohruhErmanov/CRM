const namePattern = /^[\p{L}][\p{L}\s‘’'-]*$/u
const emailPattern = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/

export function validateEmployee(values, positions = []) {
  const errors = {}

  if (!String(values.firstName || '').trim()) errors.firstName = 'Ism kiritilishi shart.'
  else if (!namePattern.test(values.firstName.trim())) errors.firstName = 'Faqat harflardan foydalaning.'
  else if (values.firstName.trim().length < 2) errors.firstName = 'Kamida 2 belgi kiriting.'

  if (!String(values.lastName || '').trim()) errors.lastName = 'Familiya kiritilishi shart.'
  else if (!namePattern.test(values.lastName.trim())) errors.lastName = 'Faqat harflardan foydalaning.'
  else if (values.lastName.trim().length < 2) errors.lastName = 'Kamida 2 belgi kiriting.'

  const phone = String(values.phone || '').replace(/[\s()-]/g, '')
  if (!phone) errors.phone = 'Telefon raqami kiritilishi shart.'
  else if (!/^(?:\+998|998|0)[1-9]\d{8}$/.test(phone)) errors.phone = 'Misol: +998901234567.'

  if (!String(values.email || '').trim()) errors.email = 'Elektron pochta kiritilishi shart.'
  else if (!emailPattern.test(values.email.trim())) errors.email = 'To‘g‘ri manzil kiriting, masalan: ism@example.uz.'

  if (!values.departmentId) errors.departmentId = 'Bo‘lim tanlanishi shart.'
  if (!values.positionId) errors.positionId = 'Lavozim tanlanishi shart.'
  else if (values.departmentId && !positions.some((position) => String(position.id) === String(values.positionId))) {
    errors.positionId = 'Tanlangan bo‘limga tegishli lavozimni tanlang.'
  }

  if (!values.hireDate) errors.hireDate = 'Ishga kirgan sana tanlanishi shart.'
  else if (values.hireDate > new Date().toISOString().slice(0, 10)) errors.hireDate = 'Kelajakdagi sana tanlab bo‘lmaydi.'

  if (values.salary === '' || values.salary === undefined || values.salary === null) {
    errors.salary = 'Maosh kiritilishi shart.'
  } else if (!/^\d+$/.test(String(values.salary))) {
    errors.salary = 'Faqat butun son kiriting.'
  } else if (Number(values.salary) < 0) {
    errors.salary = 'Maosh manfiy bo‘lishi mumkin emas.'
  }

  return errors
}

export function validateDepartment(values) {
  const errors = {}
  const name = String(values.name || '').trim()
  if (!name) errors.name = 'Bo‘lim nomi kiritilishi shart.'
  else if (name.length < 2) errors.name = 'Kamida 2 belgi kiriting.'
  else if (name.length > 80) errors.name = 'Eng ko‘p 80 belgi kiriting.'
  if (String(values.description || '').length > 500) errors.description = 'Eng ko‘p 500 belgi kiriting.'
  return errors
}

export function validatePosition(values) {
  const errors = {}
  const name = String(values.name || '').trim()
  if (!name) errors.name = 'Lavozim nomi kiritilishi shart.'
  else if (name.length < 2) errors.name = 'Kamida 2 belgi kiriting.'
  else if (name.length > 80) errors.name = 'Eng ko‘p 80 belgi kiriting.'
  if (!values.departmentId) errors.departmentId = 'Bo‘lim tanlanishi shart.'
  if (String(values.description || '').length > 500) errors.description = 'Eng ko‘p 500 belgi kiriting.'
  return errors
}

export function serverErrorsToFields(details) {
  const fields = {
    Ism: 'firstName', Familiya: 'lastName', 'Telefon raqami': 'phone',
    'Elektron pochta': 'email', 'Bo‘lim': 'departmentId', Lavozim: 'positionId',
    'Ishga kirgan sana': 'hireDate', Maosh: 'salary',
  }
  const result = {}
  ;(details || []).forEach((detail) => {
    const field = fields[detail.field]
    if (field) result[field] = detail.message
  })
  return result
}
