import { getDb } from '../config/database.js'
import {
  createEmployee as createEmployeeRow,
  deleteEmployee as deleteEmployeeRow,
  findEmployeeByEmail,
  findEmployeeById,
  findEmployeeByPhone,
  listEmployees as listEmployeeRows,
  listRecentEmployees,
  updateEmployee as updateEmployeeRow,
  updateEmployeeStatus as updateEmployeeStatusRow,
} from '../models/employee.model.js'
import { findDepartmentById } from '../models/department.model.js'
import { findPositionById } from '../models/position.model.js'
import { logActivity } from '../models/activity.model.js'
import { badRequest, conflict, notFound } from '../utils/app-error.js'
import { transaction } from '../utils/transaction.js'
import { validateEmployeePayload, validateStatus } from '../validators/employee.validator.js'
import { validateIdParam } from '../validators/common.validator.js'
import { deletePhoto, savePhoto } from './upload.service.js'

function parsePositiveInt(value, fallback, max = Number.MAX_SAFE_INTEGER) {
  const parsed = Number(value)
  return Number.isInteger(parsed) && parsed > 0 ? Math.min(parsed, max) : fallback
}

function ensureRelations({ departmentId, positionId }) {
  if (!findDepartmentById(departmentId)) {
    throw badRequest('Tanlangan bo‘lim mavjud emas.', [{ field: 'Bo‘lim', message: 'Bo‘limni qayta tanlang.' }])
  }
  const position = findPositionById(positionId)
  if (!position) {
    throw badRequest('Tanlangan lavozim mavjud emas.', [{ field: 'Lavozim', message: 'Lavozimni qayta tanlang.' }])
  }
  if (position.departmentId !== departmentId) {
    throw badRequest('Tanlangan lavozim tanlangan bo‘limga tegishli emas.', [
      { field: 'Lavozim', message: 'Avval bo‘limni, so‘ng unga tegishli lavozimni tanlang.' },
    ])
  }
}

function ensureUnique(data, excludeId = 0) {
  if (findEmployeeByEmail(data.email, excludeId)) {
    throw conflict('Bu elektron pochta bilan xodim allaqachon mavjud.', 'ELEKTRON_POCHTA_TAKROR')
  }
  if (findEmployeeByPhone(data.phone, excludeId)) {
    throw conflict('Bu telefon raqami bilan xodim allaqachon mavjud.', 'TELEFON_TAKROR')
  }
}

export function listEmployees(query = {}) {
  const search = typeof query.q === 'string' ? query.q.trim().slice(0, 100) : ''
  const departmentId = query.department_id ? parsePositiveInt(query.department_id, null) : null
  const positionId = query.position_id ? parsePositiveInt(query.position_id, null) : null
  const status = query.status === 'active' || query.status === 'blocked' ? query.status : null
  const sortBy = [
    'id', 'name', 'phone', 'email', 'department', 'position',
    'salary', 'hireDate', 'status', 'createdAt',
  ].includes(query.sort_by) ? query.sort_by : 'createdAt'
  const sortOrder = query.sort_order === 'asc' ? 'asc' : 'desc'

  return listEmployeeRows({
    search,
    departmentId,
    positionId,
    status,
    sortBy,
    sortOrder,
    page: parsePositiveInt(query.page, 1),
    limit: parsePositiveInt(query.limit, 10, 100),
  })
}

export function getEmployee(id) {
  const employee = findEmployeeById(validateIdParam(id, 'Xodim'))
  if (!employee) throw notFound('Xodim topilmadi.')
  return employee
}

export function createEmployee(payload, file) {
  const data = validateEmployeePayload(payload)
  ensureRelations(data)
  ensureUnique(data)

  const photoPath = savePhoto(file)
  try {
    return transaction(getDb(), () => {
      const employee = createEmployeeRow({ ...data, photoPath })
      logActivity(
        getDb(), 'employee', employee.id, 'create',
        `${employee.firstName} ${employee.lastName} ismli xodim qo‘shildi.`,
      )
      return employee
    })
  } catch (error) {
    deletePhoto(photoPath)
    throw error
  }
}

export function updateEmployee(id, payload, file) {
  const employeeId = validateIdParam(id, 'Xodim')
  const existing = findEmployeeById(employeeId)
  if (!existing) throw notFound('Xodim topilmadi.')

  const data = validateEmployeePayload(payload)
  ensureRelations(data)
  ensureUnique(data, employeeId)

  let photoPath = existing.photoPath
  let photoToDelete = null
  if (file) {
    photoPath = savePhoto(file)
    photoToDelete = existing.photoPath
  } else if (data.removePhoto) {
    photoPath = null
    photoToDelete = existing.photoPath
  }

  try {
    const employee = transaction(getDb(), () => {
      const updated = updateEmployeeRow(employeeId, { ...data, photoPath })
      logActivity(
        getDb(), 'employee', employeeId, 'update',
        `${updated.firstName} ${updated.lastName} maʼlumotlari yangilandi.`,
      )
      return updated
    })
    deletePhoto(photoToDelete)
    return employee
  } catch (error) {
    if (file) deletePhoto(photoPath)
    throw error
  }
}

export function updateEmployeeStatus(id, status) {
  const employeeId = validateIdParam(id, 'Xodim')
  const nextStatus = validateStatus(status)
  const existing = findEmployeeById(employeeId)
  if (!existing) throw notFound('Xodim topilmadi.')
  if (existing.status === nextStatus) {
    throw badRequest('Xodim allaqachon shu holatda.', [
      { field: 'Holat', message: 'Boshqa holat tanlang.' },
    ])
  }

  return transaction(getDb(), () => {
    const employee = updateEmployeeStatusRow(employeeId, nextStatus)
    logActivity(
      getDb(), 'employee', employeeId, 'status',
      nextStatus === 'active'
        ? `${employee.firstName} ${employee.lastName} faollashtirildi.`
        : `${employee.firstName} ${employee.lastName} bloklandi.`,
    )
    return employee
  })
}

export function deleteEmployee(id) {
  const employeeId = validateIdParam(id, 'Xodim')
  const existing = findEmployeeById(employeeId)
  if (!existing) throw notFound('Xodim topilmadi.')

  transaction(getDb(), () => {
    deleteEmployeeRow(employeeId)
    logActivity(
      getDb(), 'employee', employeeId, 'delete',
      `${existing.firstName} ${existing.lastName} ismli xodim o‘chirildi.`,
    )
  })
  deletePhoto(existing.photoPath)
  return { id: employeeId }
}

export function getRecentEmployees() {
  return listRecentEmployees(5)
}
