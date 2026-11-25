import { getDb } from '../config/database.js'

function toDepartment(row) {
  return {
    id: Number(row.id),
    name: row.name,
    description: row.description,
    employeeCount: Number(row.employee_count || 0),
    positionCount: Number(row.position_count || 0),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

const selectFields = `
  SELECT d.id, d.name, d.description, d.created_at, d.updated_at,
    (SELECT COUNT(*) FROM employees e WHERE e.department_id = d.id) AS employee_count,
    (SELECT COUNT(*) FROM positions p WHERE p.department_id = d.id) AS position_count
  FROM departments d
`

export function listDepartments({ search = '', page = 1, limit = 50 } = {}) {
  const db = getDb()
  const where = search ? 'WHERE d.name LIKE :search OR d.description LIKE :search' : ''
  const params = search ? { search: `%${search}%` } : {}
  const total = Number(
    db.prepare(`SELECT COUNT(*) AS total FROM departments d ${where}`).get(params).total,
  )
  const rows = db
    .prepare(`${selectFields} ${where} ORDER BY d.name COLLATE NOCASE ASC LIMIT :limit OFFSET :offset`)
    .all({ ...params, limit, offset: (page - 1) * limit })
  return {
    items: rows.map(toDepartment),
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit) || 1,
  }
}

export function listAllDepartments() {
  return getDb()
    .prepare(`${selectFields} ORDER BY d.name COLLATE NOCASE ASC`)
    .all()
    .map(toDepartment)
}

export function findDepartmentById(id) {
  const row = getDb().prepare(`${selectFields} WHERE d.id = :id`).get({ id })
  return row ? toDepartment(row) : null
}

export function findDepartmentByName(name, excludeId = 0) {
  const row = getDb()
    .prepare('SELECT id, name FROM departments WHERE name = :name COLLATE NOCASE AND id <> :excludeId')
    .get({ name, excludeId })
  return row ? { ...row, id: Number(row.id) } : null
}

export function createDepartment({ name, description }) {
  const result = getDb()
    .prepare('INSERT INTO departments (name, description) VALUES (:name, :description)')
    .run({ name, description })
  return findDepartmentById(Number(result.lastInsertRowid))
}

export function updateDepartment(id, { name, description }) {
  getDb()
    .prepare(
      `UPDATE departments
       SET name = :name, description = :description,
           updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
       WHERE id = :id`,
    )
    .run({ id, name, description })
  return findDepartmentById(id)
}

export function deleteDepartment(id) {
  return getDb().prepare('DELETE FROM departments WHERE id = :id').run({ id }).changes > 0
}

export function countDepartmentPositions(id) {
  return Number(
    getDb().prepare('SELECT COUNT(*) AS total FROM positions WHERE department_id = :id').get({ id }).total,
  )
}
