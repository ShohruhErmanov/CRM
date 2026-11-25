import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Avatar from '../../components/common/Avatar.jsx'
import BarChart from '../../components/common/BarChart.jsx'
import DonutChart from '../../components/common/DonutChart.jsx'
import Icon from '../../components/common/Icon.jsx'
import LineChart from '../../components/common/LineChart.jsx'
import StatCard from '../../components/common/StatCard.jsx'
import { EmptyState, ErrorState, LoadingState } from '../../components/common/StateViews.jsx'
import { api } from '../../services/api.js'
import { formatDate, formatDateTime, formatNumber } from '../../utils/format.js'

const actionIcons = { create: 'plus', update: 'edit', delete: 'trash', status: 'refresh' }

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback(() => {
    setLoading(true)
    setError('')
    api.statistics.get()
      .then((data) => setStats(data))
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { load() }, [load])

  if (loading) return <LoadingState label="Statistika yuklanmoqda…" />
  if (error) return <ErrorState message={error} onRetry={load} />
  if (!stats) return null

  const { totals } = stats
  const noEmployees = totals.totalEmployees === 0

  return (
    <div className="page-stack">
      <section className="stat-grid">
        <StatCard title="Jami xodimlar" value={formatNumber(totals.totalEmployees)} icon="users" hint="Ro‘yxatdagi barcha xodimlar" />
        <StatCard title="Faol xodimlar" value={formatNumber(totals.activeEmployees)} icon="checkCircle" hint="Ishga joylashgan xodimlar" />
        <StatCard title="Bloklangan xodimlar" value={formatNumber(totals.blockedEmployees)} icon="ban" hint="Vaqtincha cheklanganlar" />
        <StatCard title="Jami bo‘limlar" value={formatNumber(totals.totalDepartments)} icon="building" hint="Tashkiliy tuzilma" />
      </section>

      <section className="analytics-grid">
        <article className="card">
          <header className="card__header">
            <div><h2>Bo‘limlar bo‘yicha statistika</h2><p>Xodimlar soni bo‘limlar kesimida</p></div>
            <Icon name="building" size={18} />
          </header>
          <BarChart
            data={stats.byDepartment.map((item) => ({ label: item.name, value: item.total }))}
            emptyText="Hozircha bo‘limlarda xodim yo‘q."
          />
        </article>
        <article className="card">
          <header className="card__header">
            <div><h2>Lavozimlar bo‘yicha statistika</h2><p>Eng ko‘p xodim ishlaydigan lavozimlar</p></div>
            <Icon name="briefcase" size={18} />
          </header>
          <BarChart
            data={stats.byPosition.filter((item) => item.total > 0).slice(0, 7).map((item) => ({ label: item.name, value: item.total, sublabel: item.departmentName }))}
            emptyText="Hozircha hech bir lavozimga xodim biriktirilmagan."
          />
        </article>
      </section>

      <section className="analytics-grid">
        <article className="card">
          <header className="card__header">
            <div><h2>Xodimlar faoliyati grafigi</h2><p>Faol va bloklangan xodimlar nisbati</p></div>
            <Icon name="chart" size={18} />
          </header>
          {noEmployees ? (
            <EmptyState title="Faoliyat maʼlumoti yo‘q" description="Xodim qo‘shilganda bu yerda ko‘rsatiladi." icon="chart" />
          ) : (
            <DonutChart
              segments={[{ label: 'Faol', value: stats.activity.active }, { label: 'Bloklangan', value: stats.activity.blocked }]}
              total={totals.totalEmployees}
              centerLabel="xodim"
            />
          )}
        </article>
        <article className="card">
          <header className="card__header">
            <div><h2>Ishga olish tendensiyasi</h2><p>Oxirgi 12 oy bo‘yicha yollash dinamikasi</p></div>
            <Icon name="calendar" size={18} />
          </header>
          <LineChart data={stats.hiringTrend} />
        </article>
      </section>

      <section className="analytics-grid">
        <article className="card">
          <header className="card__header">
            <div><h2>Oxirgi qo‘shilgan xodimlar</h2><p>Eng so‘nggi besh yozuv</p></div>
            <Link to="/xodimlar" className="card__link">Barchasi <Icon name="chevronRight" size={14} /></Link>
          </header>
          {stats.recentEmployees.length ? (
            <ul className="activity-list">
              {stats.recentEmployees.map((employee) => (
                <li key={employee.id}>
                  <Avatar employee={employee} size="small" />
                  <div className="activity-list__body">
                    <strong>{employee.firstName} {employee.lastName}</strong>
                    <span>{employee.departmentName} · {employee.positionName}</span>
                  </div>
                  <time>{formatDate(employee.hireDate)}</time>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState title="Xodimlar yo‘q" description="Birinchi xodimni qo‘shish uchun Xodimlar bo‘limiga o‘ting." icon="users" />
          )}
        </article>
        <article className="card">
          <header className="card__header">
            <div><h2>Oxirgi bajarilgan amallar</h2><p>Tizimdagi so‘nggi harakatlar</p></div>
            <Icon name="clock" size={18} />
          </header>
          {stats.recentActivity.length ? (
            <ul className="activity-list">
              {stats.recentActivity.map((item) => (
                <li key={item.id}>
                  <span className="activity-list__icon"><Icon name={actionIcons[item.action] || 'info'} size={16} /></span>
                  <div className="activity-list__body">
                    <strong>{item.description}</strong>
                    <span>{formatDateTime(item.createdAt)}</span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState title="Amallar yo‘q" description="Xodim yoki bo‘lim ustida amal bajarganingizda bu yerda ko‘rinadi." icon="clock" />
          )}
        </article>
      </section>
    </div>
  )
}
