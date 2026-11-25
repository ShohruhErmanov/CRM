import { useState } from 'react';
import { salesTransactions as initialSales } from '../mockData';
import { DownloadIcon, SalesIcon } from '../Icons';

export default function SalesView({ searchTerm = '' }) {
  const [sales] = useState(initialSales);
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = sales.filter(s => {
    const matchesSearch = s.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.package.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || s.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const handleDownloadInvoice = (id) => {
    alert(`Downloading verified tax invoice #${id}...`);
  };

  return (
    <div>
      <div className="finora-page-title-row">
        <div>
          <h1 className="finora-page-title">Sales & Billing Ledger</h1>
          <p className="finora-page-subtitle">Audited client invoices, payment settlement records, and transaction histories</p>
        </div>
        <div className="finora-action-group">
          <button
            type="button"
            className="finora-btn finora-btn-primary"
            onClick={() => alert('New Sales Quote generator opened.')}
          >
            <SalesIcon size={16} />
            <span>Generate Invoice</span>
          </button>
        </div>
      </div>

      <div className="finora-panel">
        <div className="finora-panel-header" style={{ flexWrap: 'wrap', gap: 12 }}>
          <div>
            <span style={{ fontSize: 13, color: 'var(--finora-text-secondary)' }}>
              Recent Transactions ({filtered.length} records)
            </span>
          </div>

          <div className="finora-tabs">
            <button
              type="button"
              className={`finora-tab-btn ${statusFilter === 'all' ? 'active' : ''}`}
              onClick={() => setStatusFilter('all')}
            >
              All Transactions
            </button>
            <button
              type="button"
              className={`finora-tab-btn ${statusFilter === 'paid' ? 'active' : ''}`}
              onClick={() => setStatusFilter('paid')}
            >
              Paid
            </button>
            <button
              type="button"
              className={`finora-tab-btn ${statusFilter === 'processing' ? 'active' : ''}`}
              onClick={() => setStatusFilter('processing')}
            >
              Processing
            </button>
          </div>
        </div>

        <div className="finora-table-wrap">
          <table className="finora-table">
            <thead>
              <tr>
                <th>Invoice Number</th>
                <th>Client Organization</th>
                <th>Purchased Service Package</th>
                <th>Amount Billed</th>
                <th>Issue Date</th>
                <th>Payment Route</th>
                <th>Settlement Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id}>
                  <td style={{ color: 'var(--finora-primary)', fontWeight: 600, fontFamily: 'monospace' }}>
                    {item.id}
                  </td>
                  <td style={{ fontWeight: 600, color: 'var(--finora-text-primary)' }}>{item.client}</td>
                  <td style={{ color: 'var(--finora-text-secondary)' }}>{item.package}</td>
                  <td style={{ fontWeight: 700, color: 'var(--finora-text-primary)' }}>{item.amount}</td>
                  <td style={{ color: 'var(--finora-text-muted)', fontSize: 12 }}>{item.date}</td>
                  <td style={{ color: 'var(--finora-text-secondary)' }}>{item.method}</td>
                  <td>
                    <span className={`finora-status-pill ${item.status.toLowerCase() === 'paid' ? 'completed' : 'in-progress'}`}>
                      {item.status}
                    </span>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="finora-btn finora-btn-secondary"
                      style={{ padding: '4px 10px', fontSize: 11 }}
                      onClick={() => handleDownloadInvoice(item.id)}
                    >
                      <DownloadIcon size={12} />
                      <span>PDF</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
