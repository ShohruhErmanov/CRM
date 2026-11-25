import { useState } from 'react';
import { analyticsReportsData } from '../mockData';
import { DownloadIcon, CalendarIcon } from '../Icons';

export default function AnalyticsReports() {
  const [reportType, setReportType] = useState('revenue'); // 'revenue' | 'employee' | 'customers'
  const [dateRange, setDateRange] = useState('Q4-2026');

  // Functional Report Export
  const handleExport = (format) => {
    let content;
    let mimeType;
    let fileName = `Finora_${reportType}_report_${dateRange}`;

    if (format === 'csv') {
      mimeType = 'text/csv';
      fileName += '.csv';
      if (reportType === 'revenue') {
        content = 'Channel,Revenue ($),Share (%),Growth\n' +
          analyticsReportsData.revenueBreakdown
            .map(r => `"${r.channel}",${r.revenue},${r.percentage}%,${r.growth}`)
            .join('\n');
      } else if (reportType === 'employee') {
        content = 'Name,Role,Deals Closed,Target Achieved (%),Rating,Status\n' +
          analyticsReportsData.employeePerformance
            .map(e => `"${e.name}","${e.role}",${e.deals},${e.targetAchieved}%,${e.rating},"${e.status}"`)
            .join('\n');
      } else {
        content = 'Region,Active Clients,Market Share (%)\n' +
          analyticsReportsData.customerStats.regions
            .map(c => `"${c.name}",${c.clients},${c.percentage}%`)
            .join('\n');
      }
    } else {
      mimeType = 'application/json';
      fileName += '.json';
      content = JSON.stringify(analyticsReportsData, null, 2);
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="finora-panel">
      <div className="finora-panel-header" style={{ flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div className="finora-panel-title">Analytics & Intelligence Reports</div>
          <div className="finora-panel-subtitle">Audited data breakdown and performance ratios</div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          {/* Date Filter selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--finora-bg-main)', border: '1px solid var(--finora-border)', borderRadius: 8, padding: '4px 8px', fontSize: 12 }}>
            <CalendarIcon size={14} style={{ color: 'var(--finora-primary)' }} />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              style={{ background: 'transparent', border: 'none', color: 'var(--finora-text-primary)', outline: 'none', fontSize: 12, cursor: 'pointer' }}
            >
              <option value="Q4-2026" style={{ background: '#161E2E' }}>Q4 2026 (Current)</option>
              <option value="Q3-2026" style={{ background: '#161E2E' }}>Q3 2026</option>
              <option value="Full-Year-2026" style={{ background: '#161E2E' }}>Full Year 2026</option>
            </select>
          </div>

          {/* Sub tabs */}
          <div className="finora-tabs">
            <button
              type="button"
              className={`finora-tab-btn ${reportType === 'revenue' ? 'active' : ''}`}
              onClick={() => setReportType('revenue')}
            >
              Revenue Streams
            </button>
            <button
              type="button"
              className={`finora-tab-btn ${reportType === 'employee' ? 'active' : ''}`}
              onClick={() => setReportType('employee')}
            >
              Staff Performance
            </button>
            <button
              type="button"
              className={`finora-tab-btn ${reportType === 'customers' ? 'active' : ''}`}
              onClick={() => setReportType('customers')}
            >
              Customer Stats
            </button>
          </div>

          {/* Export Button */}
          <button
            type="button"
            className="finora-btn finora-btn-secondary"
            onClick={() => handleExport('csv')}
            style={{ padding: '6px 12px', fontSize: 12 }}
            title="Download CSV Spreadsheet"
          >
            <DownloadIcon size={14} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Report Content based on Report Type */}
      {reportType === 'revenue' && (
        <div>
          <div className="finora-table-wrap">
            <table className="finora-table">
              <thead>
                <tr>
                  <th>Revenue Channel</th>
                  <th>Quarterly Total</th>
                  <th>Share</th>
                  <th>Growth vs Target</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {analyticsReportsData.revenueBreakdown.map((item, index) => (
                  <tr key={index}>
                    <td style={{ fontWeight: 600 }}>{item.channel}</td>
                    <td style={{ color: 'var(--finora-primary)', fontWeight: 600 }}>
                      ${item.revenue.toLocaleString()}
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span>{item.percentage}%</span>
                        <div style={{ flex: 1, height: 6, background: 'var(--finora-bg-main)', borderRadius: 3, maxWidth: 80, overflow: 'hidden' }}>
                          <div style={{ width: `${item.percentage}%`, height: '100%', background: 'var(--finora-primary)' }} />
                        </div>
                      </div>
                    </td>
                    <td style={{ color: 'var(--finora-success)', fontWeight: 600 }}>
                      {item.growth}
                    </td>
                    <td>
                      <span className="finora-status-pill completed">Audited</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {reportType === 'employee' && (
        <div>
          <div className="finora-table-wrap">
            <table className="finora-table">
              <thead>
                <tr>
                  <th>Team Member</th>
                  <th>Role</th>
                  <th>Deals Closed</th>
                  <th>Quota %</th>
                  <th>Rating</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {analyticsReportsData.employeePerformance.map((emp, index) => (
                  <tr key={index}>
                    <td style={{ fontWeight: 600 }}>{emp.name}</td>
                    <td style={{ color: 'var(--finora-text-secondary)' }}>{emp.role}</td>
                    <td>{emp.deals} contracts</td>
                    <td style={{ color: emp.targetAchieved >= 100 ? 'var(--finora-success)' : 'var(--finora-warning)', fontWeight: 600 }}>
                      {emp.targetAchieved}%
                    </td>
                    <td>★ {emp.rating}</td>
                    <td>
                      <span className={`finora-status-pill ${emp.targetAchieved >= 110 ? 'completed' : 'verified'}`}>
                        {emp.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {reportType === 'customers' && (
        <div>
          {/* Key Ratio Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 16 }}>
            <div style={{ background: 'var(--finora-bg-surface)', padding: 12, borderRadius: 10, border: '1px solid var(--finora-border)' }}>
              <div style={{ fontSize: 11, color: 'var(--finora-text-muted)' }}>RETENTION RATE</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--finora-success)' }}>
                {analyticsReportsData.customerStats.retentionRate}
              </div>
            </div>
            <div style={{ background: 'var(--finora-bg-surface)', padding: 12, borderRadius: 10, border: '1px solid var(--finora-border)' }}>
              <div style={{ fontSize: 11, color: 'var(--finora-text-muted)' }}>NET PROMOTER (NPS)</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--finora-primary)' }}>
                +{analyticsReportsData.customerStats.netPromoterScore}
              </div>
            </div>
            <div style={{ background: 'var(--finora-bg-surface)', padding: 12, borderRadius: 10, border: '1px solid var(--finora-border)' }}>
              <div style={{ fontSize: 11, color: 'var(--finora-text-muted)' }}>AVERAGE LTV</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--finora-text-primary)' }}>
                {analyticsReportsData.customerStats.averageLTV}
              </div>
            </div>
            <div style={{ background: 'var(--finora-bg-surface)', padding: 12, borderRadius: 10, border: '1px solid var(--finora-border)' }}>
              <div style={{ fontSize: 11, color: 'var(--finora-text-muted)' }}>CHURN RATE</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--finora-success)' }}>
                {analyticsReportsData.customerStats.churnRate}
              </div>
            </div>
          </div>

          {/* Regional Table */}
          <div className="finora-table-wrap">
            <table className="finora-table">
              <thead>
                <tr>
                  <th>Global Territory</th>
                  <th>Active Client Accounts</th>
                  <th>Market Share</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {analyticsReportsData.customerStats.regions.map((reg, index) => (
                  <tr key={index}>
                    <td style={{ fontWeight: 600 }}>{reg.name}</td>
                    <td>{reg.clients.toLocaleString()} companies</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span>{reg.percentage}%</span>
                        <div style={{ flex: 1, height: 6, background: 'var(--finora-bg-main)', borderRadius: 3, maxWidth: 100, overflow: 'hidden' }}>
                          <div style={{ width: `${reg.percentage * 2}%`, height: '100%', background: 'var(--finora-primary)' }} />
                        </div>
                      </div>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="finora-btn finora-btn-secondary"
                        style={{ padding: '3px 8px', fontSize: 11 }}
                        onClick={() => alert(`Viewing regional breakdown for ${reg.name}`)}
                      >
                        Drill Down
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
