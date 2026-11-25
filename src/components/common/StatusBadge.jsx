export default function StatusBadge({ status }) {
  const active = status === 'active'
  return (
    <span className={`status-badge ${active ? 'status-badge--active' : 'status-badge--blocked'}`}>
      <span className="status-badge__dot" />
      {active ? 'Faol' : 'Bloklangan'}
    </span>
  )
}
