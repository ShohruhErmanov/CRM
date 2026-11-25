import Icon from './Icon.jsx'

export function LoadingState({ label = 'Yuklanmoqda…' }) {
  return (
    <div className="state-view">
      <span className="spinner" aria-hidden="true" />
      <p>{label}</p>
    </div>
  )
}

export function EmptyState({ title, description, icon = 'info', action }) {
  return (
    <div className="state-view state-view--empty">
      <div className="state-view__icon"><Icon name={icon} size={26} /></div>
      <h3>{title}</h3>
      {description && <p>{description}</p>}
      {action}
    </div>
  )
}

export function ErrorState({ message, onRetry }) {
  return (
    <div className="state-view state-view--error">
      <div className="state-view__icon"><Icon name="alert" size={26} /></div>
      <h3>Xatolik yuz berdi</h3>
      <p>{message}</p>
      {onRetry && (
        <button type="button" className="button button--secondary" onClick={onRetry}>
          <Icon name="refresh" size={16} /> Qayta urinish
        </button>
      )}
    </div>
  )
}
