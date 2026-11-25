import { shortMonthLabel } from '../../utils/format.js'

export default function LineChart({ data = [] }) {
  const width = 640
  const height = 210
  const padding = { left: 12, right: 12, top: 14, bottom: 12 }
  const values = data.map((item) => Number(item.total) || 0)
  const max = Math.max(...values, 1)
  const stepX = data.length > 1 ? (width - padding.left - padding.right) / (data.length - 1) : 0
  const points = values.map((value, index) => ({
    x: padding.left + index * stepX,
    y: height - padding.top - (value / max) * (height - padding.top - padding.bottom),
  }))
  const line = points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ')
  const area = points.length ? `${line} L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z` : ''

  return (
    <div className="line-chart">
      <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" role="img" aria-label="Ishga olish tendensiyasi">
        {[0, 1, 2, 3].map((row) => {
          const y = padding.top + (row * (height - padding.top - padding.bottom)) / 3
          return <line key={row} x1="0" x2={width} y1={y} y2={y} className="line-chart__grid" vectorEffect="non-scaling-stroke" />
        })}
        {points.length > 1 && <path d={area} className="line-chart__area" />}
        {points.length > 1 && <path d={line} className="line-chart__line" vectorEffect="non-scaling-stroke" />}
        {points.map((point, index) => (
          <circle key={index} cx={point.x} cy={point.y} r="3" className="line-chart__dot" vectorEffect="non-scaling-stroke" />
        ))}
      </svg>
      <div className="line-chart__labels">
        {data.map((item, index) => (
          <span key={item.month} className={index % 3 === 0 || index === data.length - 1 ? '' : 'is-hidden'}>
            {shortMonthLabel(item.month)}
          </span>
        ))}
      </div>
    </div>
  )
}
