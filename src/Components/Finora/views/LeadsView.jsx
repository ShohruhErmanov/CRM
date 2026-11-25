import { useState } from 'react';
import { leadsList as initialLeads } from '../mockData';
import { PlusIcon } from '../Icons';

export default function LeadsView({ searchTerm = '' }) {
  const [leads] = useState(initialLeads);
  const [stageFilter, setStageFilter] = useState('all');

  const filtered = leads.filter(l => {
    const matchesSearch = l.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          l.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          l.assignedTo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStage = stageFilter === 'all' || l.stage.toLowerCase().includes(stageFilter.toLowerCase());
    return matchesSearch && matchesStage;
  });

  return (
    <div>
      <div className="finora-page-title-row">
        <div>
          <h1 className="finora-page-title">Leads Pipeline</h1>
          <p className="finora-page-subtitle">Track inbound opportunities, deal probability, and sales rep assignments</p>
        </div>
        <div className="finora-action-group">
          <button
            type="button"
            className="finora-btn finora-btn-primary"
            onClick={() => alert('New lead capture form')}
          >
            <PlusIcon size={16} />
            <span>Capture New Lead</span>
          </button>
        </div>
      </div>

      {/* Stage Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 20 }}>
        <div style={{ background: 'var(--finora-bg-card)', border: '1px solid var(--finora-border)', borderRadius: 12, padding: 14 }}>
          <div style={{ fontSize: 11, color: 'var(--finora-text-muted)', textTransform: 'uppercase' }}>STAGE 1: NEW</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--finora-text-primary)', marginTop: 4 }}>342 Leads</div>
          <div style={{ fontSize: 11, color: 'var(--finora-text-secondary)', marginTop: 2 }}>$185,000 Potential</div>
        </div>
        <div style={{ background: 'var(--finora-bg-card)', border: '1px solid var(--finora-border)', borderRadius: 12, padding: 14 }}>
          <div style={{ fontSize: 11, color: 'var(--finora-text-muted)', textTransform: 'uppercase' }}>STAGE 2: CONTACTED</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--finora-primary)', marginTop: 4 }}>218 Leads</div>
          <div style={{ fontSize: 11, color: 'var(--finora-text-secondary)', marginTop: 2 }}>$290,000 Potential</div>
        </div>
        <div style={{ background: 'var(--finora-bg-card)', border: '1px solid var(--finora-border)', borderRadius: 12, padding: 14 }}>
          <div style={{ fontSize: 11, color: 'var(--finora-text-muted)', textTransform: 'uppercase' }}>STAGE 3: PROPOSAL</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--finora-warning)', marginTop: 4 }}>164 Leads</div>
          <div style={{ fontSize: 11, color: 'var(--finora-text-secondary)', marginTop: 2 }}>$410,000 Potential</div>
        </div>
        <div style={{ background: 'var(--finora-bg-card)', border: '1px solid var(--finora-border)', borderRadius: 12, padding: 14 }}>
          <div style={{ fontSize: 11, color: 'var(--finora-text-muted)', textTransform: 'uppercase' }}>STAGE 4: QUALIFIED</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--finora-success)', marginTop: 4 }}>348 Leads</div>
          <div style={{ fontSize: 11, color: 'var(--finora-text-secondary)', marginTop: 2 }}>$720,000 Potential</div>
        </div>
      </div>

      <div className="finora-panel">
        <div className="finora-panel-header" style={{ flexWrap: 'wrap', gap: 12 }}>
          <div>
            <span style={{ fontSize: 13, color: 'var(--finora-text-secondary)' }}>
              Total Active Opportunities ({filtered.length} leads)
            </span>
          </div>

          <div className="finora-tabs">
            <button
              type="button"
              className={`finora-tab-btn ${stageFilter === 'all' ? 'active' : ''}`}
              onClick={() => setStageFilter('all')}
            >
              All Stages
            </button>
            <button
              type="button"
              className={`finora-tab-btn ${stageFilter === 'qualified' ? 'active' : ''}`}
              onClick={() => setStageFilter('qualified')}
            >
              Qualified
            </button>
            <button
              type="button"
              className={`finora-tab-btn ${stageFilter === 'proposal' ? 'active' : ''}`}
              onClick={() => setStageFilter('proposal')}
            >
              Proposal Sent
            </button>
            <button
              type="button"
              className={`finora-tab-btn ${stageFilter === 'new' ? 'active' : ''}`}
              onClick={() => setStageFilter('new')}
            >
              New
            </button>
          </div>
        </div>

        <div className="finora-table-wrap">
          <table className="finora-table">
            <thead>
              <tr>
                <th>Lead ID</th>
                <th>Target Company</th>
                <th>Contact Person</th>
                <th>Pipeline Stage</th>
                <th>Deal Value</th>
                <th>Win Probability</th>
                <th>Assigned Account Exec</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((lead) => (
                <tr key={lead.id}>
                  <td style={{ color: 'var(--finora-text-muted)', fontFamily: 'monospace' }}>{lead.id}</td>
                  <td style={{ fontWeight: 600, color: 'var(--finora-text-primary)' }}>{lead.company}</td>
                  <td style={{ color: 'var(--finora-text-secondary)' }}>{lead.contact}</td>
                  <td>
                    <span
                      style={{
                        padding: '3px 8px',
                        borderRadius: 6,
                        fontSize: 11,
                        fontWeight: 600,
                        background: lead.stage === 'Qualified' ? 'var(--finora-success-bg)' : 'rgba(59, 130, 246, 0.12)',
                        color: lead.stage === 'Qualified' ? 'var(--finora-success)' : 'var(--finora-primary)'
                      }}
                    >
                      {lead.stage}
                    </span>
                  </td>
                  <td style={{ fontWeight: 700, color: 'var(--finora-text-primary)' }}>{lead.potential}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontWeight: 600, fontSize: 12 }}>{lead.probability}</span>
                      <div style={{ width: 50, height: 4, background: 'var(--finora-bg-main)', borderRadius: 2, overflow: 'hidden' }}>
                        <div style={{ width: lead.probability, height: '100%', background: 'var(--finora-success)' }} />
                      </div>
                    </div>
                  </td>
                  <td style={{ color: 'var(--finora-text-secondary)' }}>{lead.assignedTo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
