import { useCallback, useEffect, useState } from 'react'
import BarChart from '../../components/common/BarChart.jsx'
import DonutChart from '../../components/common/DonutChart.jsx'
import Icon from '../../components/common/Icon.jsx'
import LineChart from '../../components/common/LineChart.jsx'
import StatCard from '../../components/common/StatCard.jsx'
import { EmptyState, ErrorState, LoadingState } from '../../components/common/StateViews.jsx'
import { useToast } from '../../hooks/useToast.js'
import { api } from '../../services/api.js'
import { formatMoney, formatNumber, monthLabel } from '../../utils/format.js'

export default function Statistics() {
  const toast = useToast()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback((showToast = false) => {
    setLoading(true)
    setError('')
    return api.statistics.get()
      .then((data) => {
        setStats(data)
        if (showToast) toast.success('Statistika maʼlumotlari yangilandi.')
      })
      .catch((requestError) => {
        setError(requestError.message)
        if (showToast) toast.error(requestError.message)
      })
      .finally(() => setLoading(false))
  }, [toast])

  useEffect(() => { load() }, [load])

  if (loading && !stats) return <LoadingState label="Statistika hisoblanmoqda…" />
  if (error && !stats) return <ErrorState message={error} onRetry={() => load()} />
  if (!stats) return null

  const { totals } = stats

  return (
    <div className="page-stack">
      <div className="page-actions">
        <p className="muted">Maʼlumotlar bevosita maʼlumotlar bazasidan olinadi.</p>
        <button type="button" className="button button--secondary" onClick={() => load(true)} disabled={loading}>
          <Icon name="refresh" size={16} /> Maʼlumotlarni yangilash
        </button>
      </div>

      <section className="stat-grid stat-grid--six">
        <StatCard title="Jami xodimlar" value={formatNumber(totals.totalEmployees)} icon="users" />
        <StatCard title="Faol xodimlar" value={formatNumber(totals.activeEmployees)} icon="checkCircle" />
        <StatCard title="Bloklangan xodimlar" value={formatNumber(totals.blockedEmployees)} icon="ban" />
        <StatCard title="Jami bo‘limlar" value={formatNumber(totals.totalDepartments)} icon="building" />
        <StatCard title="Jami lavozimlar" value={formatNumber(totals.totalPositions)} icon="briefcase" />
        <StatCard title="Jami maosh fondi" value={formatMoney(totals.totalSalary)} icon="wallet" />
      </section>

      <section className="analytics-grid">
        <article className="card">
          <header className="card__header">
            <div><h2>Bo‘limlar bo‘yicha statistika</h2><p>Har bir bo‘limdagi xodimlar soni</p></div>
            <Icon name="building" size={18} />
          </header>
          <BarChart data={stats.byDepartment.map((item) => ({ label: item.name, value: item.total }))} emptyText="Bo‘limlar mavjud emas." />
        </article>
        <article className="card">
          <header className="card__header">
            <div><h2>Lavozimlar bo‘yicha statistika</h2><p>Lavozim va ularga biriktirilgan xodimlar</p></div>
            <Icon name="briefcase" size={18} />
          </header>
          <BarChart
            data={stats.byPosition.slice(0, 10).map((item) => ({ label: item.name, value: item.total, sublabel: item.departmentName }))}
            emptyText="Lavozimlar mavjud emas."
          />
        </article>
      </section>

      <section className="analytics-grid">
        <article className="card">
          <header className="card__header">
            <div><h2>Xodimlar faoliyati grafigi</h2><p>Holat bo‘yicha taqsimot</p></div>
            <Icon name="chart" size={18} />
          </header>
          {totals.totalEmployees === 0 ? (
            <EmptyState title="Xodimlar yo‘q" description="Faoliyat statistikasi xodimlar qo‘shilganda paydo bo‘ladi." icon="users" />
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
            <div><h2>Ishga olish tendensiyasi</h2><p>Oxirgi 12 oy ichidagi qabul dinamikasi</p></div>
            <Icon name="calendar" size={18} />
          </header>
          <LineChart data={stats.hiringTrend} />
        </article>
      </section>

      <section className="card">
        <header className="card__header">
          <div><h2>Oylar bo‘yicha yollash</h2><p>Ishga kirgan xodimlar soni</p></div>
          <Icon name="clock" size={18} />
        </header>
        {stats.hiringTrend.some((item) => item.total > 0) ? (
          <div className="table-scroll">
            <table className="data-table">
              <thead><tr><th>Oy</th><th>Yangi xodimlar</th></tr></thead>
              <tbody>
                {[...stats.hiringTrend].reverse().map((item) => (
                  <tr key={item.month}><td>{monthLabel(item.month)}</td><td><span className="count-pill">{item.total}</span></td></tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState title="Yollash maʼlumoti yo‘q" description="Ishga kirgan sanalari bo‘lgan xodimlar qo‘shilganda bu yerda ko‘rsatiladi." icon="calendar" />
        )}
      </section>
    </div>
  )
}
