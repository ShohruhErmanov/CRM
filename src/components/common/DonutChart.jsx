export default function DonutChart({ segments = [], total = 0, centerLabel = 'Jami' }) {
  const radius = 54
  const circumference = 2 * Math.PI * radius
  let offset = 0

  return (
    <div className="donut-chart">
      <div className="donut-chart__visual">
        <svg viewBox="0 0 140 140" width="160" height="160" role="img" aria-label={`${centerLabel}: ${total}`}>
          <circle cx="70" cy="70" r={radius} className="donut-chart__track" />
          {segments.map((segment, index) => {
            const value = Number(segment.value) || 0
            const length = total > 0 ? (value / total) * circumference : 0
            const dashOffset = -offset
            offset += length
            return (
              <circle
                key={segment.label}
                cx="70" cy="70" r={radius}
                className={`donut-chart__segment donut-chart__segment--${index}`}
                strokeDasharray={`${length} ${circumference - length}`}
                strokeDashoffset={dashOffset}
                transform="rotate(-90 70 70)"
              />
            )
          })}
        </svg>
        <div className="donut-chart__center">
          <strong>{total}</strong>
          <span>{centerLabel}</span>
        </div>
      </div>
      <div className="donut-chart__legend">
        {segments.map((segment, index) => (
          <div className="donut-chart__legend-item" key={segment.label}>
            <span className={`donut-chart__swatch donut-chart__swatch--${index}`} />
            <span>{segment.label}</span>
            <strong>{segment.value}</strong>
          </div>
        ))}
      </div>
    </div>
  )
}
