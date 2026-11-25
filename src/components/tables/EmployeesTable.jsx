import Avatar from '../common/Avatar.jsx'
import Icon from '../common/Icon.jsx'
import StatusBadge from '../common/StatusBadge.jsx'
import { formatDate, formatMoney, formatNumber } from '../../utils/format.js'

const columns = [
  { key: 'id', label: 'Tartib raqami' },
  { key: 'photo', label: 'Rasm', sortable: false },
  { key: 'name', label: 'Ism va familiya' },
  { key: 'phone', label: 'Telefon' },
  { key: 'email', label: 'Elektron pochta' },
  { key: 'department', label: 'Bo‘lim' },
  { key: 'position', label: 'Lavozim' },
  { key: 'salary', label: 'Maosh' },
  { key: 'hireDate', label: 'Ishga kirgan sana' },
  { key: 'status', label: 'Holat' },
  { key: 'actions', label: 'Amallar', sortable: false },
]

export default function EmployeesTable({ employees, startIndex = 0, sortBy, sortOrder, onSort, onView, onEdit, onStatus, onDelete }) {
  return (
    <div className="table-scroll">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key}>
                {column.sortable === false ? (
                  column.label
                ) : (
                  <button
                    type="button"
                    className={`sort-button ${sortBy === column.key ? 'is-active' : ''}`}
                    onClick={() => onSort(column.key)}
                    title={`${column.label} bo‘yicha tartiblash`}
                  >
                    {column.label}
                    <Icon name={sortBy === column.key && sortOrder === 'asc' ? 'arrowUp' : 'arrowDown'} size={13} />
                  </button>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {employees.map((employee, index) => (
            <tr key={employee.id}>
              <td className="muted">{formatNumber(startIndex + index + 1)}</td>
              <td><Avatar employee={employee} size="small" /></td>
              <td>
                <button type="button" className="cell-link" onClick={() => onView(employee)}>
                  {employee.firstName} {employee.lastName}
                </button>
              </td>
              <td className="muted">{employee.phone}</td>
              <td className="muted">{employee.email}</td>
              <td>{employee.departmentName}</td>
              <td>{employee.positionName}</td>
              <td className="numeric">{formatMoney(employee.salary)}</td>
              <td className="muted">{formatDate(employee.hireDate)}</td>
              <td><StatusBadge status={employee.status} /></td>
              <td>
                <div className="row-actions">
                  <button type="button" className="icon-button" onClick={() => onView(employee)} title="Batafsil ko‘rish" aria-label="Batafsil ko‘rish"><Icon name="eye" size={16} /></button>
                  <button type="button" className="icon-button" onClick={() => onEdit(employee)} title="Tahrirlash" aria-label="Tahrirlash"><Icon name="edit" size={16} /></button>
                  <button type="button" className="icon-button" onClick={() => onStatus(employee)} title={employee.status === 'active' ? 'Bloklash' : 'Faollashtirish'} aria-label={employee.status === 'active' ? 'Bloklash' : 'Faollashtirish'}>
                    <Icon name={employee.status === 'active' ? 'ban' : 'checkCircle'} size={16} />
                  </button>
                  <button type="button" className="icon-button" onClick={() => onDelete(employee)} title="O‘chirish" aria-label="O‘chirish"><Icon name="trash" size={16} /></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
