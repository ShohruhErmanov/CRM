import { EmptyState } from './StateViews.jsx'

export default function BarChart({ data = [], emptyText = 'Ko‘rsatish uchun maʼlumot yo‘q.' }) {
  const max = Math.max(...data.map((item) => Number(item.value) || 0), 0)
  if (!data.length || max === 0) {
    return <EmptyState title="Maʼlumot yo‘q" description={emptyText} icon="chart" />
  }

  return (
    <div className="bar-chart">
      {data.map((item, index) => (
        <div className="bar-chart__row" key={`${item.label}-${index}`}>
          <div className="bar-chart__meta">
            <span title={item.sublabel ? `${item.label} — ${item.sublabel}` : item.label}>{item.label}</span>
            <strong>{item.value}</strong>
          </div>
          <div className="bar-chart__track">
            <div
              className="bar-chart__fill"
              style={{ width: `${Math.max((Number(item.value) / max) * 100, 2)}%`, opacity: 1 - index * 0.045 }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
