import { useCallback, useEffect, useMemo, useState } from 'react'
import Avatar from '../../components/common/Avatar.jsx'
import ConfirmDialog from '../../components/common/ConfirmDialog.jsx'
import EmptyState from '../../components/common/EmptyState.jsx'
import EmployeeForm from '../../components/forms/EmployeeForm.jsx'
import Icon from '../../components/common/Icon.jsx'
import Modal from '../../components/common/Modal.jsx'
import Pagination from '../../components/common/Pagination.jsx'
import StatusBadge from '../../components/common/StatusBadge.jsx'
import EmployeesTable from '../../components/tables/EmployeesTable.jsx'
import { ErrorState, LoadingState } from '../../components/common/StateViews.jsx'
import { useToast } from '../../contexts/ToastContext.jsx'
import { useDebounce } from '../../hooks/useDebounce.js'
import { api } from '../../services/api.js'
import { formatDate, formatMoney } from '../../utils/format.js'

const initialFilters = { q: '', departmentId: '', positionId: '', status: '' }

export default function Employees() {
  const toast = useToast()
  const [searchInput, setSearchInput] = useState('')
  const debouncedSearch = useDebounce(searchInput, 350)
  const [filters, setFilters] = useState(initialFilters)
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState('desc')
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [refreshKey, setRefreshKey] = useState(0)
  const [data, setData] = useState({ items: [], total: 0, totalPages: 1 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [departments, setDepartments] = useState([])
  const [positions, setPositions] = useState([])
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [viewing, setViewing] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [statusTarget, setStatusTarget] = useState(null)
  const [actionBusy, setActionBusy] = useState(false)
  const [actionError, setActionError] = useState('')

  useEffect(() => {
    api.departments.list({ limit: 100 })
      .then((result) => setDepartments(result.items))
      .catch((requestError) => toast.error(requestError.message))
    api.positions.list({ limit: 100 })
      .then((result) => setPositions(result.items))
      .catch((requestError) => toast.error(requestError.message))
  }, [toast])

  useEffect(() => {
    setFilters((current) => ({ ...current, q: debouncedSearch }))
    setPage(1)
  }, [debouncedSearch])

  const filterPositions = useMemo(
    () => positions.filter((position) => !filters.departmentId || String(position.departmentId) === String(filters.departmentId)),
    [positions, filters.departmentId],
  )

  const load = useCallback(() => {
    const controller = new AbortController()
    setLoading(true)
    setError('')
    api.employees.list({
      ...filters,
      sort_by: sortBy,
      sort_order: sortOrder,
      page,
      limit,
    })
      .then((result) => setData(result))
      .catch((requestError) => {
        if (requestError.name !== 'AbortError') setError(requestError.message)
      })
      .finally(() => setLoading(false))
    return () => controller.abort()
  }, [filters, sortBy, sortOrder, page, limit, refreshKey])

  useEffect(() => { load() }, [load])

  const changeFilter = (field, value) => {
    setFilters((current) => ({
      ...current,
      [field]: value,
      ...(field === 'departmentId' ? { positionId: '' } : {}),
    }))
    setPage(1)
  }

  const resetFilters = () => {
    setSearchInput('')
    setFilters(initialFilters)
    setPage(1)
  }

  const handleSort = (column) => {
    if (sortBy === column) setSortOrder((current) => (current === 'asc' ? 'desc' : 'asc'))
    else {
      setSortBy(column)
      setSortOrder('asc')
    }
    setPage(1)
  }

  const afterMutation = () => {
    setRefreshKey((key) => key + 1)
    setViewing(null)
  }

  const confirmRemove = async () => {
    setActionBusy(true)
    setActionError('')
    try {
      await api.employees.remove(deleteTarget.id)
      toast.success(`${deleteTarget.firstName} ${deleteTarget.lastName} o‘chirildi.`)
      setDeleteTarget(null)
      afterMutation()
    } catch (requestError) {
      setActionError(requestError.message)
      toast.error(requestError.message)
    } finally {
      setActionBusy(false)
    }
  }

  const confirmStatus = async () => {
    setActionBusy(true)
    setActionError('')
    const nextStatus = statusTarget.status === 'active' ? 'blocked' : 'active'
    try {
      await api.employees.updateStatus(statusTarget.id, nextStatus)
      toast.success(nextStatus === 'active' ? 'Xodim faollashtirildi.' : 'Xodim bloklandi.')
      setStatusTarget(null)
      afterMutation()
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
          <form className="toolbar__filters" onSubmit={(event) => { event.preventDefault(); setFilters({ ...filters, q: searchInput }); setPage(1) }}>
            <label className="search-field">
              <Icon name="search" size={17} />
              <input value={searchInput} onChange={(event) => setSearchInput(event.target.value)} placeholder="Ism yoki telefon bo‘yicha qidirish" aria-label="Qidirish" />
              <button type="submit" className="search-field__button">Qidirish</button>
            </label>
            <select value={filters.departmentId} onChange={(event) => changeFilter('departmentId', event.target.value)} aria-label="Bo‘lim bo‘yicha filtr">
              <option value="">Barcha bo‘limlar</option>
              {departments.map((department) => <option value={department.id} key={department.id}>{department.name}</option>)}
            </select>
            <select value={filters.positionId} onChange={(event) => changeFilter('positionId', event.target.value)} aria-label="Lavozim bo‘yicha filtr">
              <option value="">Barcha lavozimlar</option>
              {filterPositions.map((position) => <option value={position.id} key={position.id}>{position.name}</option>)}
            </select>
            <select value={filters.status} onChange={(event) => changeFilter('status', event.target.value)} aria-label="Holat bo‘yicha filtr">
              <option value="">Barcha holatlar</option>
              <option value="active">Faol</option>
              <option value="blocked">Bloklangan</option>
            </select>
            <button type="button" className="button button--ghost" onClick={resetFilters}>Tozalash</button>
          </form>
          <button type="button" className="button button--primary" onClick={() => { setEditing(null); setFormOpen(true) }}>
            <Icon name="plus" size={17} /> Yangi xodim qo‘shish
          </button>
        </div>

        {loading ? (
          <LoadingState label="Xodimlar yuklanmoqda…" />
        ) : error ? (
          <ErrorState message={error} onRetry={load} />
        ) : data.items.length === 0 ? (
          <EmptyState
            title="Xodimlar topilmadi"
            description={Object.values(filters).some(Boolean) ? 'Filtrlarni o‘zgartirib qayta urinib ko‘ring.' : 'Birinchi xodimni qo‘shish uchun yuqoridagi tugmadan foydalaning.'}
            icon="users"
            action={Object.values(filters).some(Boolean) ? <button type="button" className="button button--secondary" onClick={resetFilters}>Filtrlarni tozalash</button> : null}
          />
        ) : (
          <>
            <EmployeesTable
              employees={data.items}
              startIndex={(page - 1) * limit}
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSort={handleSort}
              onView={setViewing}
              onEdit={(employee) => { setViewing(null); setEditing(employee); setFormOpen(true) }}
              onStatus={(employee) => { setViewing(null); setActionError(''); setStatusTarget(employee) }}
              onDelete={(employee) => { setViewing(null); setActionError(''); setDeleteTarget(employee) }}
            />
            <Pagination
              page={page}
              totalPages={data.totalPages}
              total={data.total}
              limit={limit}
              onPage={setPage}
              onLimit={(size) => { setLimit(size); setPage(1) }}
            />
          </>
        )}
      </section>

      <EmployeeForm
        open={formOpen}
        employee={editing}
        departments={departments}
        positions={positions}
        onClose={() => setFormOpen(false)}
        onSaved={afterMutation}
      />

      <Modal
        open={Boolean(viewing)}
        title="Xodim maʼlumotlari"
        subtitle={viewing ? `${viewing.firstName} ${viewing.lastName}` : ''}
        onClose={() => setViewing(null)}
        size="medium"
        footer={
          <>
            <button type="button" className="button button--ghost" onClick={() => setViewing(null)}>Yopish</button>
            {viewing && (
              <button type="button" className="button button--primary" onClick={() => { setEditing(viewing); setFormOpen(true); setViewing(null) }}>
                <Icon name="edit" size={16} /> Tahrirlash
              </button>
            )}
          </>
        }
      >
        {viewing && (
          <div className="detail-view">
            <div className="detail-view__person">
              <Avatar employee={viewing} size="large" />
              <div><h3>{viewing.firstName} {viewing.lastName}</h3><StatusBadge status={viewing.status} /></div>
            </div>
            <dl className="detail-grid">
              <div><dt>Telefon raqami</dt><dd>{viewing.phone}</dd></div>
              <div><dt>Elektron pochta</dt><dd>{viewing.email}</dd></div>
              <div><dt>Bo‘lim</dt><dd>{viewing.departmentName}</dd></div>
              <div><dt>Lavozim</dt><dd>{viewing.positionName}</dd></div>
              <div><dt>Maosh</dt><dd>{formatMoney(viewing.salary)}</dd></div>
              <div><dt>Ishga kirgan sana</dt><dd>{formatDate(viewing.hireDate)}</dd></div>
              <div><dt>Qo‘shilgan vaqt</dt><dd>{formatDate(viewing.createdAt)}</dd></div>
              <div><dt>Oxirgi yangilangan</dt><dd>{formatDate(viewing.updatedAt)}</dd></div>
            </dl>
            <div className="detail-view__actions">
              <button type="button" className="button button--secondary" onClick={() => { setStatusTarget(viewing); setViewing(null); setActionError('') }}>
                <Icon name={viewing.status === 'active' ? 'ban' : 'checkCircle'} size={16} />
                {viewing.status === 'active' ? 'Bloklash' : 'Faollashtirish'}
              </button>
              <button type="button" className="button button--secondary" onClick={() => { setDeleteTarget(viewing); setViewing(null); setActionError('') }}>
                <Icon name="trash" size={16} /> O‘chirish
              </button>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Xodimni o‘chirish"
        message={deleteTarget ? `${deleteTarget.firstName} ${deleteTarget.lastName} maʼlumotlari butunlay o‘chiriladi. Bu amalni qaytarib bo‘lmaydi.` : ''}
        confirmLabel="O‘chirish"
        icon="trash"
        busy={actionBusy}
        error={actionError}
        onConfirm={confirmRemove}
        onClose={() => setDeleteTarget(null)}
      />

      <ConfirmDialog
        open={Boolean(statusTarget)}
        title={statusTarget?.status === 'active' ? 'Xodimni bloklash' : 'Xodimni faollashtirish'}
        message={statusTarget ? (statusTarget.status === 'active'
          ? `${statusTarget.firstName} ${statusTarget.lastName} bloklanadi. Maʼlumotlar saqlanib qoladi.`
          : `${statusTarget.firstName} ${statusTarget.lastName} qaytadan faollashtiriladi.`) : ''}
        confirmLabel={statusTarget?.status === 'active' ? 'Bloklash' : 'Faollashtirish'}
        icon={statusTarget?.status === 'active' ? 'ban' : 'checkCircle'}
        busy={actionBusy}
        error={actionError}
        onConfirm={confirmStatus}
        onClose={() => setStatusTarget(null)}
      />
    </div>
  )
}
