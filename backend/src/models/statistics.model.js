import { getDb } from '../config/database.js'

export function getTotals() {
  const db = getDb()
  const employees = db
    .prepare(
      `SELECT COUNT(*) AS total,
        SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) AS active,
        SUM(CASE WHEN status = 'blocked' THEN 1 ELSE 0 END) AS blocked
       FROM employees`,
    )
    .get()
  const departments = db.prepare('SELECT COUNT(*) AS total FROM departments').get().total
  const positions = db.prepare('SELECT COUNT(*) AS total FROM positions').get().total
  const salary = db.prepare('SELECT COALESCE(SUM(salary), 0) AS total FROM employees').get().total

  return {
    totalEmployees: Number(employees.total || 0),
    activeEmployees: Number(employees.active || 0),
    blockedEmployees: Number(employees.blocked || 0),
    totalDepartments: Number(departments || 0),
    totalPositions: Number(positions || 0),
    totalSalary: Number(salary || 0),
  }
}

export function getEmployeesByDepartment() {
  return getDb()
    .prepare(
      `SELECT d.id, d.name, COUNT(e.id) AS total,
        SUM(CASE WHEN e.status = 'active' THEN 1 ELSE 0 END) AS active,
        SUM(CASE WHEN e.status = 'blocked' THEN 1 ELSE 0 END) AS blocked
       FROM departments d LEFT JOIN employees e ON e.department_id = d.id
       GROUP BY d.id ORDER BY total DESC, d.name COLLATE NOCASE ASC`,
    )
    .all()
    .map((row) => ({
      id: Number(row.id),
      name: row.name,
      total: Number(row.total || 0),
      active: Number(row.active || 0),
      blocked: Number(row.blocked || 0),
    }))
}

export function getEmployeesByPosition() {
  return getDb()
    .prepare(
      `SELECT p.id, p.name, d.name AS department_name, COUNT(e.id) AS total,
        SUM(CASE WHEN e.status = 'active' THEN 1 ELSE 0 END) AS active
       FROM positions p
       JOIN departments d ON d.id = p.department_id
       LEFT JOIN employees e ON e.position_id = p.id
       GROUP BY p.id ORDER BY total DESC, p.name COLLATE NOCASE ASC`,
    )
    .all()
    .map((row) => ({
      id: Number(row.id),
      name: row.name,
      departmentName: row.department_name,
      total: Number(row.total || 0),
      active: Number(row.active || 0),
    }))
}

export function getHiringByMonth() {
  return getDb()
    .prepare(
      `SELECT substr(hire_date, 1, 7) AS month, COUNT(*) AS total
       FROM employees GROUP BY month ORDER BY month ASC`,
    )
    .all()
    .map((row) => ({ month: row.month, total: Number(row.total || 0) }))
}
