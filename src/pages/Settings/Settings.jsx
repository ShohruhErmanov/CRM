import { useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../../components/common/Icon.jsx'
import { useToast } from '../../hooks/useToast.js'
import { api } from '../../services/api.js'
import { formatDateTime, formatNumber } from '../../utils/format.js'

const apiAddress = import.meta.env.VITE_API_URL || '/api'

export default function Settings() {
  const toast = useToast()
  const [busy, setBusy] = useState('')
  const [systemStatus, setSystemStatus] = useState('')
  const [summary, setSummary] = useState(null)

  const checkHealth = async () => {
    setBusy('health')
    try {
      await api.health.check()
      setSystemStatus('Tizim ishlamoqda.')
      toast.success('Server bilan aloqa muvaffaqiyatli.')
    } catch (error) {
      setSystemStatus(`Aloqa muvaffaqiyatsiz: ${error.message}`)
      toast.error(error.message)
    } finally {
      setBusy('')
    }
  }

  const refreshStats = async () => {
    setBusy('stats')
    try {
      const data = await api.statistics.get()
      setSummary(data.totals)
      toast.success('Maʼlumotlar yangilandi.')
    } catch (error) {
      toast.error(error.message)
    } finally {
      setBusy('')
    }
  }

  const exportEmployees = async () => {
    setBusy('export')
    try {
      const result = await api.employees.list({ page: 1, limit: 100 })
      const blob = new Blob([JSON.stringify(result.items, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'finora-xodimlar.json'
      document.body.appendChild(link)
      link.click()
      link.remove()
      URL.revokeObjectURL(url)
      toast.success(`${formatNumber(result.total)} ta xodim maʼlumoti yuklab olindi.`)
    } catch (error) {
      toast.error(error.message)
    } finally {
      setBusy('')
    }
  }

  return (
    <div className="page-stack settings-grid">
      <section className="card">
        <header className="card__header">
          <div><h2>Tizim haqida</h2><p>Finora xodimlarni boshqarish tizimi</p></div>
          <Icon name="info" size={18} />
        </header>
        <dl className="detail-grid">
          <div><dt>Nomi</dt><dd>Finora</dd></div>
          <div><dt>Versiya</dt><dd>1.0</dd></div>
          <div><dt>Maʼlumotlar bazasi</dt><dd>SQLite (keyinroq PostgreSQL ga o‘tish mumkin)</dd></div>
          <div><dt>Interfeys tili</dt><dd>O‘zbekcha</dd></div>
          <div><dt>Maʼlumotlar manzili</dt><dd>{apiAddress}</dd></div>
        </dl>
      </section>

      <section className="card">
        <header className="card__header">
          <div><h2>Vositalar</h2><p>Tizim holati va maʼlumotlar bilan ishlash</p></div>
          <Icon name="settings" size={18} />
        </header>
        <div className="settings-actions">
          <button type="button" className="settings-action" onClick={checkHealth} disabled={Boolean(busy)}>
            <span className="settings-action__icon"><Icon name="refresh" size={18} /></span>
            <span><strong>Tizim holatini tekshirish</strong><small>Server bilan bog‘lanishni tekshiradi</small></span>
            <Icon name="chevronRight" size={16} />
          </button>
          <button type="button" className="settings-action" onClick={refreshStats} disabled={Boolean(busy)}>
            <span className="settings-action__icon"><Icon name="chart" size={18} /></span>
            <span><strong>Statistikani yangilash</strong><small>Joriy ko‘rsatkichlarni qayta oladi</small></span>
            <Icon name="chevronRight" size={16} />
          </button>
          <button type="button" className="settings-action" onClick={exportEmployees} disabled={Boolean(busy)}>
            <span className="settings-action__icon"><Icon name="download" size={18} /></span>
            <span><strong>Maʼlumotlarni yuklab olish</strong><small>Xodimlar ro‘yxatini faylga saqlaydi</small></span>
            <Icon name="chevronRight" size={16} />
          </button>
        </div>
        {systemStatus && <p className="settings-status"><Icon name="info" size={15} /> {systemStatus}</p>}
        {summary && (
          <dl className="detail-grid settings-summary">
            <div><dt>Jami xodimlar</dt><dd>{formatNumber(summary.totalEmployees)}</dd></div>
            <div><dt>Faol xodimlar</dt><dd>{formatNumber(summary.activeEmployees)}</dd></div>
            <div><dt>Bloklanganlar</dt><dd>{formatNumber(summary.blockedEmployees)}</dd></div>
            <div><dt>Oxirgi yangilash</dt><dd>{formatDateTime(new Date().toISOString())}</dd></div>
          </dl>
        )}
      </section>

      <section className="card">
        <header className="card__header">
          <div><h2>Tezkor o‘tish</h2><p>Asosiy bo‘limlarga o‘tish</p></div>
          <Icon name="grid" size={18} />
        </header>
        <div className="quick-links">
          <Link to="/xodimlar"><Icon name="users" size={17} /> Xodimlar</Link>
          <Link to="/bolimlar"><Icon name="building" size={17} /> Bo‘limlar</Link>
          <Link to="/lavozimlar"><Icon name="briefcase" size={17} /> Lavozimlar</Link>
          <Link to="/statistika"><Icon name="chart" size={17} /> Statistika</Link>
        </div>
      </section>
    </div>
  )
}
