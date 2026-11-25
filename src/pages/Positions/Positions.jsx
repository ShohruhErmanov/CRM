import { useCallback, useEffect, useState } from 'react'
import ConfirmDialog from '../../components/common/ConfirmDialog.jsx'
import { EmptyState } from '../../components/common/StateViews.jsx'
import Icon from '../../components/common/Icon.jsx'
import Modal from '../../components/common/Modal.jsx'
import Pagination from '../../components/common/Pagination.jsx'
import PositionForm from '../../components/forms/PositionForm.jsx'
import { ErrorState, LoadingState } from '../../components/common/StateViews.jsx'
import { useToast } from '../../hooks/useToast.js'
import { api } from '../../services/api.js'
import { formatDate, formatNumber } from '../../utils/format.js'

export default function Positions() {
  const toast = useToast()
  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')
  const [departmentFilter, setDepartmentFilter] = useState('')
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [refreshKey, setRefreshKey] = useState(0)
  const [data, setData] = useState({ items: [], total: 0, totalPages: 1 })
  const [departments, setDepartments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [viewing, setViewing] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [actionBusy, setActionBusy] = useState(false)
  const [actionError, setActionError] = useState('')

  useEffect(() => {
    api.departments.list({ limit: 100 })
      .then((result) => setDepartments(result.items))
      .catch((requestError) => toast.error(requestError.message))
  }, [toast])

  const load = useCallback(() => {
    void refreshKey
    setLoading(true)
    setError('')
    api.positions.list({ q: search, department_id: departmentFilter, page, limit })
      .then((result) => setData(result))
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false))
  }, [search, departmentFilter, page, limit, refreshKey])

  useEffect(() => { load() }, [load])

  const confirmDelete = async () => {
    setActionBusy(true)
    setActionError('')
    try {
      await api.positions.remove(deleteTarget.id)
      toast.success(`${deleteTarget.name} lavozimi o‘chirildi.`)
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
              <input value={searchInput} onChange={(event) => setSearchInput(event.target.value)} placeholder="Lavozim nomi bo‘yicha qidirish" aria-label="Qidirish" />
              <button type="submit" className="search-field__button">Qidirish</button>
            </label>
            <select value={departmentFilter} onChange={(event) => { setDepartmentFilter(event.target.value); setPage(1) }} aria-label="Bo‘lim bo‘yicha filtr">
              <option value="">Barcha bo‘limlar</option>
              {departments.map((department) => <option value={department.id} key={department.id}>{department.name}</option>)}
            </select>
          </form>
          <button type="button" className="button button--primary" onClick={() => { setEditing(null); setFormOpen(true) }}>
            <Icon name="plus" size={17} /> Yangi lavozim qo‘shish
          </button>
        </div>

        {loading ? (
          <LoadingState label="Lavozimlar yuklanmoqda…" />
        ) : error ? (
          <ErrorState message={error} onRetry={load} />
        ) : data.items.length === 0 ? (
          <EmptyState
            title="Lavozimlar topilmadi"
            description={search || departmentFilter ? 'Filtrlarni o‘zgartirib qayta urinib ko‘ring.' : 'Birinchi lavozimni qo‘shing va uni bo‘limga biriktiring.'}
            icon="briefcase"
          />
        ) : (
          <>
            <div className="table-scroll">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Tartib raqami</th><th>Nomi</th><th>Bo‘lim</th><th>Tavsif</th><th>Xodimlar soni</th><th>Yaratilgan sana</th><th>Amallar</th>
                  </tr>
                </thead>
                <tbody>
                  {data.items.map((position, index) => (
                    <tr key={position.id}>
                      <td className="muted">{formatNumber((page - 1) * limit + index + 1)}</td>
                      <td><button type="button" className="cell-link" onClick={() => setViewing(position)}>{position.name}</button></td>
                      <td>{position.departmentName}</td>
                      <td className="muted description-cell">{position.description || '—'}</td>
                      <td><span className="count-pill">{formatNumber(position.employeeCount)}</span></td>
                      <td className="muted">{formatDate(position.createdAt)}</td>
                      <td>
                        <div className="row-actions">
                          <button type="button" className="icon-button" onClick={() => setViewing(position)} title="Batafsil ko‘rish" aria-label="Batafsil ko‘rish"><Icon name="eye" size={16} /></button>
                          <button type="button" className="icon-button" onClick={() => { setEditing(position); setFormOpen(true) }} title="Tahrirlash" aria-label="Tahrirlash"><Icon name="edit" size={16} /></button>
                          <button type="button" className="icon-button" onClick={() => { setActionError(''); setDeleteTarget(position) }} title="O‘chirish" aria-label="O‘chirish"><Icon name="trash" size={16} /></button>
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

      {formOpen && (
        <PositionForm
          open
          position={editing}
          departments={departments}
          onClose={() => setFormOpen(false)}
          onSaved={() => setRefreshKey((key) => key + 1)}
        />
      )}

      <Modal
        open={Boolean(viewing)}
        title="Lavozim maʼlumotlari"
        subtitle={viewing?.name}
        onClose={() => setViewing(null)}
        size="small"
        footer={<button type="button" className="button button--ghost" onClick={() => setViewing(null)}>Yopish</button>}
      >
        {viewing && (
          <div className="detail-view">
            <p className="detail-description">{viewing.description || 'Tavsif kiritilmagan.'}</p>
            <dl className="detail-grid">
              <div><dt>Bo‘lim</dt><dd>{viewing.departmentName}</dd></div>
              <div><dt>Xodimlar soni</dt><dd>{formatNumber(viewing.employeeCount)}</dd></div>
              <div><dt>Yaratilgan sana</dt><dd>{formatDate(viewing.createdAt)}</dd></div>
              <div><dt>Oxirgi yangilangan</dt><dd>{formatDate(viewing.updatedAt)}</dd></div>
            </dl>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Lavozimni o‘chirish"
        message={deleteTarget ? `${deleteTarget.name} lavozimi o‘chiriladi. Agar unda xodimlar ishlayotgan bo‘lsa, o‘chirish bajarilmaydi.` : ''}
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
