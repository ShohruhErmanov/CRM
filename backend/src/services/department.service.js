import { getDb } from '../config/database.js'
import {
  countDepartmentPositions,
  createDepartment,
  deleteDepartment,
  findDepartmentById,
  findDepartmentByName,
  listAllDepartments,
  listDepartments,
  updateDepartment,
} from '../models/department.model.js'
import { logActivity } from '../models/activity.model.js'
import { conflict, notFound } from '../utils/app-error.js'
import { transaction } from '../utils/transaction.js'
import { validateIdParam } from '../validators/common.validator.js'
import { validateDepartmentPayload } from '../validators/department.validator.js'

export function listDepartmentsService(query = {}) {
  const search = typeof query.q === 'string' ? query.q.trim().slice(0, 100) : ''
  const page = Number(query.page)
  const limit = Number(query.limit)
  return listDepartments({
    search,
    page: Number.isInteger(page) && page > 0 ? page : 1,
    limit: Number.isInteger(limit) && limit > 0 ? Math.min(limit, 100) : 50,
  })
}

export function getAllDepartments() {
  return listAllDepartments()
}

export function getDepartment(id) {
  const department = findDepartmentById(validateIdParam(id, 'Bo‘lim'))
  if (!department) throw notFound('Bo‘lim topilmadi.')
  return department
}

export function createDepartmentService(payload) {
  const data = validateDepartmentPayload(payload)
  if (findDepartmentByName(data.name)) {
    throw conflict('Bu nomli bo‘lim allaqachon mavjud.', 'BO_LIMITAKROR')
  }

  return transaction(getDb(), () => {
    const department = createDepartment(data)
    logActivity(getDb(), 'department', department.id, 'create', `${department.name} bo‘limi qo‘shildi.`)
    return department
  })
}

export function updateDepartmentService(id, payload) {
  const departmentId = validateIdParam(id, 'Bo‘lim')
  const existing = findDepartmentById(departmentId)
  if (!existing) throw notFound('Bo‘lim topilmadi.')

  const data = validateDepartmentPayload(payload)
  if (findDepartmentByName(data.name, departmentId)) {
    throw conflict('Bu nomli bo‘lim allaqachon mavjud.', 'BO_LIMITAKROR')
  }

  return transaction(getDb(), () => {
    const department = updateDepartment(departmentId, data)
    logActivity(getDb(), 'department', departmentId, 'update', `${department.name} bo‘limi yangilandi.`)
    return department
  })
}

export function deleteDepartmentService(id) {
  const departmentId = validateIdParam(id, 'Bo‘lim')
  const existing = findDepartmentById(departmentId)
  if (!existing) throw notFound('Bo‘lim topilmadi.')

  if (existing.employeeCount > 0) {
    throw conflict(
      `Ushbu bo‘limda ${existing.employeeCount} nafar xodim mavjud. Avval ularni boshqa bo‘limga o‘tkazing.`,
      'BO_LIMITDA_XODIM_BOR',
    )
  }
  const positionCount = countDepartmentPositions(departmentId)
  if (positionCount > 0) {
    throw conflict(
      `Ushbu bo‘limga ${positionCount} ta lavozim biriktirilgan. Avval ularni o‘chiring yoki boshqa bo‘limga o‘tkazing.`,
      'BO_LIMITDA_LAVOZIM_BOR',
    )
  }

  transaction(getDb(), () => {
    deleteDepartment(departmentId)
    logActivity(getDb(), 'department', departmentId, 'delete', `${existing.name} bo‘limi o‘chirildi.`)
  })
  return { id: departmentId }
}
