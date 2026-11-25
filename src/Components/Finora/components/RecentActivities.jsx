import { useState } from 'react';
import { recentActivitiesData } from '../mockData';
import { ClockIcon } from '../Icons';

export default function RecentActivities() {
  const [filter, setFilter] = useState('all'); // 'all' | 'sales' | 'employee' | 'registration'

  const filteredActivities = recentActivitiesData.filter((item) => {
    if (filter === 'all') return true;
    return item.type === filter;
  });

  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'completed';
      case 'verified': return 'verified';
      case 'in progress': return 'in-progress';
      case 'pending': return 'pending';
      default: return 'completed';
    }
  };

  return (
    <div className="finora-panel">
      <div className="finora-panel-header">
        <div>
          <div className="finora-panel-title">Recent Activities</div>
          <div className="finora-panel-subtitle">Real-time team actions and audit logs</div>
        </div>

        {/* Filter Pills */}
        <div className="finora-tabs">
          <button
            type="button"
            className={`finora-tab-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button
            type="button"
            className={`finora-tab-btn ${filter === 'sales' ? 'active' : ''}`}
            onClick={() => setFilter('sales')}
          >
            Sales
          </button>
          <button
            type="button"
            className={`finora-tab-btn ${filter === 'employee' ? 'active' : ''}`}
            onClick={() => setFilter('employee')}
          >
            Employees
          </button>
          <button
            type="button"
            className={`finora-tab-btn ${filter === 'registration' ? 'active' : ''}`}
            onClick={() => setFilter('registration')}
          >
            Clients
          </button>
        </div>
      </div>

      <div className="finora-activities-list">
        {filteredActivities.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '30px 10px', color: 'var(--finora-text-muted)', fontSize: 13 }}>
            No activities matching this filter.
          </div>
        ) : (
          filteredActivities.map((act) => (
            <div key={act.id} className="finora-activity-item">
              <div className="finora-activity-avatar">
                {act.avatar}
              </div>

              <div className="finora-activity-content">
                <div className="finora-activity-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span className="finora-activity-user">{act.user}</span>
                    <span style={{ fontSize: 11, color: 'var(--finora-text-muted)' }}>• {act.role}</span>
                  </div>
                  <span className="finora-activity-time">
                    <ClockIcon size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 3 }} />
                    {act.time}
                  </span>
                </div>

                <div className="finora-activity-text">
                  {act.action}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 11, color: 'var(--finora-text-muted)' }}>
                    Category: <span style={{ color: 'var(--finora-text-secondary)' }}>{act.category}</span>
                  </span>
                  <span className={`finora-status-pill ${getStatusClass(act.status)}`}>
                    {act.status}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
