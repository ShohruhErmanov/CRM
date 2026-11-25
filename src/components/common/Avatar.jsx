import { initials } from '../../utils/format.js'
import Icon from './Icon.jsx'

export default function Avatar({ employee, size = 'medium' }) {
  const photo = employee?.photoPath
  return (
    <span className={`avatar avatar--${size}`}>
      {photo ? (
        <img src={photo} alt={`${employee.firstName} ${employee.lastName} rasmi`} />
      ) : (
        <span>{initials(employee?.firstName, employee?.lastName) || <Icon name="users" size={16} />}</span>
      )}
    </span>
  )
}
