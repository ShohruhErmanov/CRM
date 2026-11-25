import { getDb } from '../config/database.js'
import { findDepartmentById } from '../models/department.model.js'
import {
  countPositionEmployees,
  createPosition,
  deletePosition,
  findPositionById,
  findPositionByNameInDepartment,
  listAllPositions,
  listPositions,
  updatePosition,
} from '../models/position.model.js'
import { logActivity } from '../models/activity.model.js'
import { badRequest, conflict, notFound } from '../utils/app-error.js'
import { transaction } from '../utils/transaction.js'
import { validateIdParam } from '../validators/common.validator.js'
import { validatePositionPayload } from '../validators/position.validator.js'

export function listPositionsService(query = {}) {
  const search = typeof query.q === 'string' ? query.q.trim().slice(0, 100) : ''
  const departmentId = query.department_id ? Number(query.department_id) : null
  const page = Number(query.page)
  const limit = Number(query.limit)
  return listPositions({
    search,
    departmentId: Number.isInteger(departmentId) && departmentId > 0 ? departmentId : null,
    page: Number.isInteger(page) && page > 0 ? page : 1,
    limit: Number.isInteger(limit) && limit > 0 ? Math.min(limit, 100) : 100,
  })
}

export function getAllPositions(departmentId = null) {
  return listAllPositions(departmentId)
}

export function getPosition(id) {
  const position = findPositionById(validateIdParam(id, 'Lavozim'))
  if (!position) throw notFound('Lavozim topilmadi.')
  return position
}

function ensureDepartment(departmentId) {
  if (!findDepartmentById(departmentId)) {
    throw badRequest('Tanlangan bo‘lim mavjud emas.', [
      { field: 'Bo‘lim', message: 'Bo‘limni qayta tanlang.' },
    ])
  }
}

export function createPositionService(payload) {
  const data = validatePositionPayload(payload)
  ensureDepartment(data.departmentId)
  if (findPositionByNameInDepartment(data.name, data.departmentId)) {
    throw conflict('Bu bo‘limda bunday lavozim allaqachon mavjud.', 'LAVOZIMTAKROR')
  }

  return transaction(getDb(), () => {
    const position = createPosition(data)
    logActivity(
      getDb(), 'position', position.id, 'create',
      `${position.name} lavozimi ${position.departmentName} bo‘limiga qo‘shildi.`,
    )
    return position
  })
}

export function updatePositionService(id, payload) {
  const positionId = validateIdParam(id, 'Lavozim')
  const existing = findPositionById(positionId)
  if (!existing) throw notFound('Lavozim topilmadi.')

  const data = validatePositionPayload(payload)
  ensureDepartment(data.departmentId)
  if (findPositionByNameInDepartment(data.name, data.departmentId, positionId)) {
    throw conflict('Bu bo‘limda bunday lavozim allaqachon mavjud.', 'LAVOZIMTAKROR')
  }
  if (data.departmentId !== existing.departmentId && existing.employeeCount > 0) {
    throw conflict(
      `Ushbu lavozimda ${existing.employeeCount} nafar xodim ishlaydi. Bo‘limni o‘zgartirish uchun avval ularni boshqa lavozimga o‘tkazing.`,
      'LAVOZIMDA_XODIM_BOR',
    )
  }

  return transaction(getDb(), () => {
    const position = updatePosition(positionId, data)
    logActivity(getDb(), 'position', positionId, 'update', `${position.name} lavozimi yangilandi.`)
    return position
  })
}

export function deletePositionService(id) {
  const positionId = validateIdParam(id, 'Lavozim')
  const existing = findPositionById(positionId)
  if (!existing) throw notFound('Lavozim topilmadi.')

  const employeeCount = countPositionEmployees(positionId)
  if (employeeCount > 0) {
    throw conflict(
      `Ushbu lavozimda ${employeeCount} nafar xodim ishlaydi. Avval ularni boshqa lavozimga o‘tkazing.`,
      'LAVOZIMDA_XODIM_BOR',
    )
  }

  transaction(getDb(), () => {
    deletePosition(positionId)
    logActivity(getDb(), 'position', positionId, 'delete', `${existing.name} lavozimi o‘chirildi.`)
  })
  return { id: positionId }
}
