import { useState } from 'react';
import { salesChartData } from '../mockData';
import { TrendingUpIcon, TrendingDownIcon } from '../Icons';

export default function SalesChart() {
  const [period, setPeriod] = useState('monthly'); // 'monthly' | 'yearly'
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const data = salesChartData[period];
  const maxRevenue = Math.max(...data.map(d => Math.max(d.revenue, d.target))) * 1.15;
  const minRevenue = 0;

  // Chart dimensions
  const svgWidth = 680;
  const svgHeight = 230;
  const paddingLeft = 55;
  const paddingRight = 25;
  const paddingTop = 20;
  const paddingBottom = 35;

  const chartWidth = svgWidth - paddingLeft - paddingRight;
  const chartHeight = svgHeight - paddingTop - paddingBottom;

  // Coordinate calculations
  const getX = (index) => paddingLeft + (index / (data.length - 1)) * chartWidth;
  const getY = (val) => paddingTop + chartHeight - ((val - minRevenue) / (maxRevenue - minRevenue)) * chartHeight;

  // Path for Revenue Area & Line
  const points = data.map((d, i) => `${getX(i)},${getY(d.revenue)}`).join(' ');
  const areaPath = `${points} L ${getX(data.length - 1)},${paddingTop + chartHeight} L ${getX(0)},${paddingTop + chartHeight} Z`;

  // Path for Target Line (dashed)
  const targetPoints = data.map((d, i) => `${getX(i)},${getY(d.target)}`).join(' ');

  // Y-axis grid ticks (4 steps)
  const yTicks = [0, 0.33, 0.66, 1].map(ratio => {
    const val = minRevenue + ratio * (maxRevenue - minRevenue);
    return {
      y: paddingTop + chartHeight - ratio * chartHeight,
      val: period === 'monthly' ? `$${Math.round(val / 1000)}k` : `$${(val / 1000).toFixed(0)}k`
    };
  });

  const activeItem = hoveredIndex !== null ? data[hoveredIndex] : data[data.length - 1];

  return (
    <div className="finora-panel">
      {/* Panel Header */}
      <div className="finora-panel-header">
        <div>
          <div className="finora-panel-title">Sales Analytics & Growth</div>
          <div className="finora-panel-subtitle">
            Revenue trajectory vs target projections
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Quick Stat Pill */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--finora-text-secondary)' }}>
            <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: 'var(--finora-primary)' }} />
            <span>Revenue</span>
            <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: '#64748B', marginLeft: 6 }} />
            <span>Target</span>
          </div>

          {/* Period Tabs */}
          <div className="finora-tabs">
            <button
              type="button"
              className={`finora-tab-btn ${period === 'monthly' ? 'active' : ''}`}
              onClick={() => {
                setPeriod('monthly');
                setHoveredIndex(null);
              }}
            >
              Monthly
            </button>
            <button
              type="button"
              className={`finora-tab-btn ${period === 'yearly' ? 'active' : ''}`}
              onClick={() => {
                setPeriod('yearly');
                setHoveredIndex(null);
              }}
            >
              Yearly
            </button>
          </div>
        </div>
      </div>

      {/* Metric Highlight Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, background: 'var(--finora-bg-surface)', padding: '10px 16px', borderRadius: 10, border: '1px solid var(--finora-border)' }}>
        <div>
          <span style={{ fontSize: 11, color: 'var(--finora-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Selected {period === 'monthly' ? 'Month' : 'Year'}:
          </span>
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--finora-text-primary)', marginLeft: 6 }}>
            {activeItem.label}
          </span>
        </div>
        <div>
          <span style={{ fontSize: 11, color: 'var(--finora-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Recorded Revenue:
          </span>
          <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--finora-primary)', marginLeft: 6 }}>
            ${activeItem.revenue.toLocaleString()}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ fontSize: 11, color: 'var(--finora-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Growth:
          </span>
          <span
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: activeItem.growth >= 0 ? 'var(--finora-success)' : 'var(--finora-danger)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 2
            }}
          >
            {activeItem.growth >= 0 ? <TrendingUpIcon size={13} /> : <TrendingDownIcon size={13} />}
            {activeItem.growth >= 0 ? `+${activeItem.growth}%` : `${activeItem.growth}%`}
          </span>
        </div>
      </div>

      {/* SVG Chart */}
      <div className="finora-chart-container">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="finora-chart-svg"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.0" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#3B82F6" floodOpacity="0.4" />
            </filter>
          </defs>

          {/* Grid lines */}
          {yTicks.map((tick, i) => (
            <g key={i}>
              <line
                x1={paddingLeft}
                y1={tick.y}
                x2={svgWidth - paddingRight}
                y2={tick.y}
                stroke="#1E293B"
                strokeWidth="1"
                strokeDasharray={i === 0 ? 'none' : '3 3'}
              />
              <text
                x={paddingLeft - 10}
                y={tick.y + 4}
                textAnchor="end"
                fontSize="10"
                fill="#64748B"
                fontFamily="sans-serif"
              >
                {tick.val}
              </text>
            </g>
          ))}

          {/* Target Projected Curve (Dashed) */}
          <polyline
            fill="none"
            stroke="#64748B"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            points={targetPoints}
          />

          {/* Area under revenue */}
          <polygon
            fill="url(#revenueGradient)"
            points={areaPath}
          />

          {/* Main Revenue Curve */}
          <polyline
            fill="none"
            stroke="#3B82F6"
            strokeWidth="2.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#glow)"
            points={points}
          />

          {/* Hover Column Guide & Data Points */}
          {data.map((item, index) => {
            const x = getX(index);
            const y = getY(item.revenue);
            const isHovered = hoveredIndex === index;

            return (
              <g
                key={index}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                style={{ cursor: 'pointer' }}
              >
                {/* Invisible hover trigger column */}
                <rect
                  x={x - (chartWidth / (data.length - 1)) / 2}
                  y={paddingTop}
                  width={chartWidth / (data.length - 1)}
                  height={chartHeight}
                  fill="transparent"
                />

                {/* Vertical hover guide */}
                {isHovered && (
                  <line
                    x1={x}
                    y1={paddingTop}
                    x2={x}
                    y2={paddingTop + chartHeight}
                    stroke="rgba(59, 130, 246, 0.4)"
                    strokeWidth="1.5"
                    strokeDasharray="2 2"
                  />
                )}

                {/* Point dot */}
                <circle
                  cx={x}
                  cy={y}
                  r={isHovered ? 6 : 3.5}
                  fill={isHovered ? '#FFFFFF' : '#3B82F6'}
                  stroke="#161E2E"
                  strokeWidth="2"
                  style={{ transition: 'all 0.2s ease' }}
                />

                {/* X-axis label */}
                <text
                  x={x}
                  y={paddingTop + chartHeight + 20}
                  textAnchor="middle"
                  fontSize="11"
                  fontWeight={isHovered ? '600' : '400'}
                  fill={isHovered ? '#F1F5F9' : '#94A3B8'}
                  fontFamily="sans-serif"
                >
                  {item.label}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Hover Tooltip Overlay */}
        {hoveredIndex !== null && (
          <div
            className="finora-chart-tooltip"
            style={{
              left: `${(getX(hoveredIndex) / svgWidth) * 100}%`,
              top: `${(getY(data[hoveredIndex].revenue) / svgHeight) * 100 - 10}%`
            }}
          >
            <div style={{ fontWeight: 600, color: 'var(--finora-text-primary)', marginBottom: 2 }}>
              {data[hoveredIndex].label} {period === 'monthly' ? '2026' : ''}
            </div>
            <div style={{ color: 'var(--finora-primary)', fontWeight: 700 }}>
              Revenue: ${data[hoveredIndex].revenue.toLocaleString()}
            </div>
            <div style={{ color: 'var(--finora-text-muted)', fontSize: 11 }}>
              Target: ${data[hoveredIndex].target.toLocaleString()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
