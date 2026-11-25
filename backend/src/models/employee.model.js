import { getDb } from '../config/database.js'

function toEmployee(row) {
  return {
    id: Number(row.id),
    firstName: row.first_name,
    lastName: row.last_name,
    phone: row.phone,
    email: row.email,
    departmentId: Number(row.department_id),
    departmentName: row.department_name,
    positionId: Number(row.position_id),
    positionName: row.position_name,
    hireDate: row.hire_date,
    salary: Number(row.salary),
    status: row.status,
    photoPath: row.photo_path || null,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

const selectFields = `
  SELECT e.id, e.first_name, e.last_name, e.phone, e.email,
    e.department_id, e.position_id, e.hire_date, e.salary, e.status,
    e.photo_path, e.created_at, e.updated_at,
    d.name AS department_name, p.name AS position_name
  FROM employees e
  JOIN departments d ON d.id = e.department_id
  JOIN positions p ON p.id = e.position_id
`

const sortColumns = {
  id: 'e.id',
  name: "e.first_name || ' ' || e.last_name",
  phone: 'e.phone',
  email: 'e.email',
  department: 'd.name',
  position: 'p.name',
  salary: 'e.salary',
  hireDate: 'e.hire_date',
  status: 'e.status',
  createdAt: 'e.created_at',
}

export function listEmployees({
  search = '',
  departmentId = null,
  positionId = null,
  status = null,
  sortBy = 'createdAt',
  sortOrder = 'desc',
  page = 1,
  limit = 10,
} = {}) {
  const db = getDb()
  const clauses = []
  const params = {}

  if (search) {
    clauses.push("(e.first_name || ' ' || e.last_name LIKE :search OR e.phone LIKE :search OR e.email LIKE :search)")
    params.search = `%${search}%`
  }
  if (departmentId) {
    clauses.push('e.department_id = :departmentId')
    params.departmentId = departmentId
  }
  if (positionId) {
    clauses.push('e.position_id = :positionId')
    params.positionId = positionId
  }
  if (status) {
    clauses.push('e.status = :status')
    params.status = status
  }

  const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : ''
  const total = Number(
    db.prepare(`SELECT COUNT(*) AS total FROM employees e ${where}`).get(params).total,
  )
  const column = sortColumns[sortBy] || sortColumns.createdAt
  const direction = String(sortOrder).toLowerCase() === 'asc' ? 'ASC' : 'DESC'
  const rows = db
    .prepare(`${selectFields} ${where} ORDER BY ${column} ${direction}, e.id DESC LIMIT :limit OFFSET :offset`)
    .all({ ...params, limit, offset: (page - 1) * limit })

  return {
    items: rows.map(toEmployee),
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit) || 1,
  }
}

export function findEmployeeById(id) {
  const row = getDb().prepare(`${selectFields} WHERE e.id = :id`).get({ id })
  return row ? toEmployee(row) : null
}

export function findEmployeeByEmail(email, excludeId = 0) {
  const row = getDb()
    .prepare('SELECT id FROM employees WHERE email = :email COLLATE NOCASE AND id <> :excludeId')
    .get({ email, excludeId })
  return row ? { ...row, id: Number(row.id) } : null
}

export function findEmployeeByPhone(phone, excludeId = 0) {
  const row = getDb()
    .prepare('SELECT id FROM employees WHERE phone = :phone AND id <> :excludeId')
    .get({ phone, excludeId })
  return row ? { ...row, id: Number(row.id) } : null
}

export function createEmployee(data) {
  const result = getDb()
    .prepare(
      `INSERT INTO employees
        (first_name, last_name, phone, email, department_id, position_id,
         hire_date, salary, photo_path, status)
       VALUES
        (:firstName, :lastName, :phone, :email, :departmentId, :positionId,
         :hireDate, :salary, :photoPath, :status)`,
    )
    .run({ ...data, status: data.status || 'active', photoPath: data.photoPath || null })
  return findEmployeeById(Number(result.lastInsertRowid))
}

export function updateEmployee(id, data) {
  getDb()
    .prepare(
      `UPDATE employees SET
        first_name = :firstName, last_name = :lastName, phone = :phone, email = :email,
        department_id = :departmentId, position_id = :positionId, hire_date = :hireDate,
        salary = :salary, photo_path = :photoPath,
        updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
       WHERE id = :id`,
    )
    .run({ ...data, id })
  return findEmployeeById(id)
}

export function updateEmployeeStatus(id, status) {
  getDb()
    .prepare(
      `UPDATE employees SET status = :status,
       updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now') WHERE id = :id`,
    )
    .run({ id, status })
  return findEmployeeById(id)
}

export function deleteEmployee(id) {
  return getDb().prepare('DELETE FROM employees WHERE id = :id').run({ id }).changes > 0
}

export function listRecentEmployees(limit = 5) {
  return getDb()
    .prepare(`${selectFields} ORDER BY e.created_at DESC, e.id DESC LIMIT :limit`)
    .all({ limit })
    .map(toEmployee)
}
