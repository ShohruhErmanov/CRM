import { useCallback, useEffect, useState } from 'react'
import ConfirmDialog from '../../components/common/ConfirmDialog.jsx'
import DepartmentForm from '../../components/forms/DepartmentForm.jsx'
import EmptyState from '../../components/common/EmptyState.jsx'
import Icon from '../../components/common/Icon.jsx'
import Modal from '../../components/common/Modal.jsx'
import Pagination from '../../components/common/Pagination.jsx'
import { ErrorState, LoadingState } from '../../components/common/StateViews.jsx'
import { useToast } from '../../contexts/ToastContext.jsx'
import { api } from '../../services/api.js'
import { formatDate, formatNumber } from '../../utils/format.js'

export default function Departments() {
  const toast = useToast()
  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [refreshKey, setRefreshKey] = useState(0)
  const [data, setData] = useState({ items: [], total: 0, totalPages: 1 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [viewing, setViewing] = useState(null)
  const [departmentPositions, setDepartmentPositions] = useState([])
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [actionBusy, setActionBusy] = useState(false)
  const [actionError, setActionError] = useState('')

  const load = useCallback(() => {
    setLoading(true)
    setError('')
    api.departments.list({ q: search, page, limit })
      .then((result) => setData(result))
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false))
  }, [search, page, limit, refreshKey])

  useEffect(() => { load() }, [load])

  const openView = async (department) => {
    setViewing(department)
    setDepartmentPositions([])
    try {
      const result = await api.positions.list({ department_id: department.id, limit: 100 })
      setDepartmentPositions(result.items)
    } catch (requestError) {
      toast.error(requestError.message)
    }
  }

  const confirmDelete = async () => {
    setActionBusy(true)
    setActionError('')
    try {
      await api.departments.remove(deleteTarget.id)
      toast.success(`${deleteTarget.name} bo‘limi o‘chirildi.`)
      setDeleteTarget(null)
      setRefreshKey((key) => key + 1)
    } catch (requestError) {
      setActionError(requestError.message)
      toast.error(requestError.message)
    } finally {
      setActionBusy(false)
    }
  }

  return (
    <div className="page-stack">
      <section className="card">
        <div className="toolbar">
          <form className="toolbar__filters" onSubmit={(event) => { event.preventDefault(); setSearch(searchInput); setPage(1) }}>
            <label className="search-field">
              <Icon name="search" size={17} />
              <input value={searchInput} onChange={(event) => setSearchInput(event.target.value)} placeholder="Bo‘lim nomi bo‘yicha qidirish" aria-label="Qidirish" />
              <button type="submit" className="search-field__button">Qidirish</button>
            </label>
          </form>
          <button type="button" className="button button--primary" onClick={() => { setEditing(null); setFormOpen(true) }}>
            <Icon name="plus" size={17} /> Yangi bo‘lim qo‘shish
          </button>
        </div>

        {loading ? (
          <LoadingState label="Bo‘limlar yuklanmoqda…" />
        ) : error ? (
          <ErrorState message={error} onRetry={load} />
        ) : data.items.length === 0 ? (
          <EmptyState
            title="Bo‘limlar topilmadi"
            description={search ? 'Boshqa qidiruv so‘zi bilan urinib ko‘ring.' : 'Yangi bo‘lim qo‘shib tashkiliy tuzilmani yarating.'}
            icon="building"
          />
        ) : (
          <>
            <div className="table-scroll">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Tartib raqami</th><th>Nomi</th><th>Tavsif</th><th>Xodimlar soni</th><th>Lavozimlar soni</th><th>Yaratilgan sana</th><th>Amallar</th>
                  </tr>
                </thead>
                <tbody>
                  {data.items.map((department, index) => (
                    <tr key={department.id}>
                      <td className="muted">{formatNumber((page - 1) * limit + index + 1)}</td>
                      <td><button type="button" className="cell-link" onClick={() => openView(department)}>{department.name}</button></td>
                      <td className="muted description-cell">{department.description || '—'}</td>
                      <td><span className="count-pill">{formatNumber(department.employeeCount)}</span></td>
                      <td><span className="count-pill">{formatNumber(department.positionCount)}</span></td>
                      <td className="muted">{formatDate(department.createdAt)}</td>
                      <td>
                        <div className="row-actions">
                          <button type="button" className="icon-button" onClick={() => openView(department)} title="Batafsil ko‘rish" aria-label="Batafsil ko‘rish"><Icon name="eye" size={16} /></button>
                          <button type="button" className="icon-button" onClick={() => { setEditing(department); setFormOpen(true) }} title="Tahrirlash" aria-label="Tahrirlash"><Icon name="edit" size={16} /></button>
                          <button type="button" className="icon-button" onClick={() => { setActionError(''); setDeleteTarget(department) }} title="O‘chirish" aria-label="O‘chirish"><Icon name="trash" size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination page={page} totalPages={data.totalPages} total={data.total} limit={limit} onPage={setPage} onLimit={(size) => { setLimit(size); setPage(1) }} />
          </>
        )}
      </section>

      <DepartmentForm
        open={formOpen}
        department={editing}
        onClose={() => setFormOpen(false)}
        onSaved={() => setRefreshKey((key) => key + 1)}
      />

      <Modal
        open={Boolean(viewing)}
        title="Bo‘lim maʼlumotlari"
        subtitle={viewing?.name}
        onClose={() => setViewing(null)}
        size="medium"
        footer={<button type="button" className="button button--ghost" onClick={() => setViewing(null)}>Yopish</button>}
      >
        {viewing && (
          <div className="detail-view">
            <p className="detail-description">{viewing.description || 'Tavsif kiritilmagan.'}</p>
            <dl className="detail-grid">
              <div><dt>Xodimlar soni</dt><dd>{formatNumber(viewing.employeeCount)}</dd></div>
              <div><dt>Lavozimlar soni</dt><dd>{formatNumber(viewing.positionCount)}</dd></div>
              <div><dt>Yaratilgan sana</dt><dd>{formatDate(viewing.createdAt)}</dd></div>
              <div><dt>Oxirgi yangilangan</dt><dd>{formatDate(viewing.updatedAt)}</dd></div>
            </dl>
            <h3 className="detail-subtitle">Bo‘lim lavozimlari</h3>
            {departmentPositions.length ? (
              <ul className="simple-list">
                {departmentPositions.map((position) => (
                  <li key={position.id}><Icon name="briefcase" size={15} /> {position.name} <span>{formatNumber(position.employeeCount)} xodim</span></li>
                ))}
              </ul>
            ) : <p className="hint-text">Bu bo‘limga hali lavozim biriktirilmagan.</p>}
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Bo‘limni o‘chirish"
        message={deleteTarget ? `${deleteTarget.name} bo‘limi o‘chiriladi. Agar unda xodim yoki lavozim mavjud bo‘lsa, o‘chirish bajarilmaydi.` : ''}
        confirmLabel="O‘chirish"
        icon="trash"
        busy={actionBusy}
        error={actionError}
        onConfirm={confirmDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  )
}
