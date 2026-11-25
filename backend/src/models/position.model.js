import { getDb } from '../config/database.js'

function toPosition(row) {
  return {
    id: Number(row.id),
    name: row.name,
    departmentId: Number(row.department_id),
    departmentName: row.department_name,
    description: row.description,
    employeeCount: Number(row.employee_count || 0),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

const selectFields = `
  SELECT p.id, p.name, p.department_id, p.description, p.created_at, p.updated_at,
    d.name AS department_name,
    (SELECT COUNT(*) FROM employees e WHERE e.position_id = p.id) AS employee_count
  FROM positions p
  JOIN departments d ON d.id = p.department_id
`

export function listPositions({ search = '', departmentId = null, page = 1, limit = 100 } = {}) {
  const db = getDb()
  const clauses = []
  const params = {}
  if (search) {
    clauses.push('(p.name LIKE :search OR p.description LIKE :search OR d.name LIKE :search)')
    params.search = `%${search}%`
  }
  if (departmentId) {
    clauses.push('p.department_id = :departmentId')
    params.departmentId = departmentId
  }
  const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : ''
  const total = Number(
    db.prepare(`SELECT COUNT(*) AS total FROM positions p JOIN departments d ON d.id = p.department_id ${where}`).get(params).total,
  )
  const rows = db
    .prepare(`${selectFields} ${where} ORDER BY d.name COLLATE NOCASE ASC, p.name COLLATE NOCASE ASC LIMIT :limit OFFSET :offset`)
    .all({ ...params, limit, offset: (page - 1) * limit })
  return {
    items: rows.map(toPosition),
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit) || 1,
  }
}

export function listAllPositions(departmentId = null) {
  const where = departmentId ? 'WHERE p.department_id = :departmentId' : ''
  const params = departmentId ? { departmentId } : {}
  return getDb()
    .prepare(`${selectFields} ${where} ORDER BY d.name COLLATE NOCASE ASC, p.name COLLATE NOCASE ASC`)
    .all(params)
    .map(toPosition)
}

export function findPositionById(id) {
  const row = getDb().prepare(`${selectFields} WHERE p.id = :id`).get({ id })
  return row ? toPosition(row) : null
}

export function findPositionByNameInDepartment(name, departmentId, excludeId = 0) {
  const row = getDb()
    .prepare(
      `SELECT id FROM positions
       WHERE name = :name COLLATE NOCASE AND department_id = :departmentId AND id <> :excludeId`,
    )
    .get({ name, departmentId, excludeId })
  return row ? { ...row, id: Number(row.id) } : null
}

export function createPosition({ name, departmentId, description }) {
  const result = getDb()
    .prepare('INSERT INTO positions (name, department_id, description) VALUES (:name, :departmentId, :description)')
    .run({ name, departmentId, description })
  return findPositionById(Number(result.lastInsertRowid))
}

export function updatePosition(id, { name, departmentId, description }) {
  getDb()
    .prepare(
      `UPDATE positions
       SET name = :name, department_id = :departmentId, description = :description,
           updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
       WHERE id = :id`,
    )
    .run({ id, name, departmentId, description })
  return findPositionById(id)
}

export function deletePosition(id) {
  return getDb().prepare('DELETE FROM positions WHERE id = :id').run({ id }).changes > 0
}

export function countPositionEmployees(id) {
  return Number(getDb().prepare('SELECT COUNT(*) AS total FROM employees WHERE position_id = :id').get({ id }).total)
}
