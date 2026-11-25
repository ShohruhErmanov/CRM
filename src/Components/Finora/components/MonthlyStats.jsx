import { monthlyStats } from '../mockData';
import { TrendingUpIcon, TrendingDownIcon, CheckCircleIcon } from '../Icons';

export default function MonthlyStats() {
  return (
    <div className="finora-panel">
      <div className="finora-panel-header">
        <div>
          <div className="finora-panel-title">Monthly Performance</div>
          <div className="finora-panel-subtitle">{monthlyStats.currentMonth} Target Goals</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--finora-success)', background: 'var(--finora-success-bg)', padding: '4px 8px', borderRadius: 6, fontWeight: 600 }}>
          <CheckCircleIcon size={14} />
          <span>On Track</span>
        </div>
      </div>

      <div className="finora-monthly-list">
        {monthlyStats.metrics.map((metric, idx) => {
          let progressColorClass = '';
          if (metric.progress >= 110) progressColorClass = 'green';
          else if (metric.progress < 100) progressColorClass = 'yellow';

          return (
            <div key={idx} className="finora-monthly-item">
              <div className="finora-monthly-meta">
                <span className="finora-monthly-label">{metric.title}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span className="finora-monthly-val">{metric.value}</span>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: metric.isPositive ? 'var(--finora-success)' : 'var(--finora-danger)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 2
                    }}
                  >
                    {metric.isPositive ? <TrendingUpIcon size={12} /> : <TrendingDownIcon size={12} />}
                    {metric.growth}
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="finora-progress-track">
                <div
                  className={`finora-progress-fill ${progressColorClass}`}
                  style={{ width: `${Math.min(metric.progress, 100)}%` }}
                />
              </div>

              <div className="finora-monthly-sub">
                <span>{metric.description}</span>
                <span>Target: {metric.target} ({metric.progress}%)</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Box */}
      <div style={{ marginTop: 20, padding: 12, borderRadius: 10, background: 'var(--finora-bg-surface)', border: '1px solid var(--finora-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 11, color: 'var(--finora-text-muted)' }}>QUARTERLY COMPLETION</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--finora-text-primary)' }}>Q4 Goal: 96.8%</div>
        </div>
        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--finora-primary)' }}>
          +12.4% vs Q3
        </div>
      </div>
    </div>
  );
}
