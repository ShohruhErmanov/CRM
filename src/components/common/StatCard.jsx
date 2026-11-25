import Icon from './Icon.jsx'

export default function StatCard({ title, value, icon, hint }) {
  return (
    <article className="stat-card">
      <div className="stat-card__top">
        <span className="stat-card__title">{title}</span>
        <span className="stat-card__icon"><Icon name={icon} size={19} /></span>
      </div>
      <strong className="stat-card__value">{value}</strong>
      {hint && <span className="stat-card__hint">{hint}</span>}
    </article>
  )
}
