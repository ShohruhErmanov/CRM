import { listRecentActivity } from '../models/activity.model.js'
import { listRecentEmployees } from '../models/employee.model.js'
import {
  getEmployeesByDepartment,
  getEmployeesByPosition,
  getHiringByMonth,
  getTotals,
} from '../models/statistics.model.js'

function buildHiringTrend(rows) {
  const counts = new Map(rows.map((row) => [row.month, row.total]))
  const trend = []
  const now = new Date()

  for (let offset = 11; offset >= 0; offset -= 1) {
    const date = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - offset, 1))
    const month = `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}`
    trend.push({ month, total: counts.get(month) || 0 })
  }
  return trend
}

export function getStatistics() {
  const totals = getTotals()
  const hiringByMonth = getHiringByMonth()

  return {
    totals,
    byDepartment: getEmployeesByDepartment(),
    byPosition: getEmployeesByPosition(),
    activity: {
      active: totals.activeEmployees,
      blocked: totals.blockedEmployees,
    },
    hiringByMonth,
    hiringTrend: buildHiringTrend(hiringByMonth),
    recentEmployees: listRecentEmployees(5),
    recentActivity: listRecentActivity(8),
    generatedAt: new Date().toISOString(),
  }
}
