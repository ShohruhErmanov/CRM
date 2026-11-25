import { useState } from 'react';
import { customersList as initialCustomers } from '../mockData';
import { PlusIcon } from '../Icons';

export default function CustomersView({ searchTerm = '' }) {
  const [customers, setCustomers] = useState(initialCustomers);
  const [tierFilter, setTierFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCust, setNewCust] = useState({ name: '', contact: '', email: '', tier: 'Enterprise', status: 'Active', spent: '$0' });

  const filtered = customers.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTier = tierFilter === 'all' || c.tier.toLowerCase() === tierFilter.toLowerCase();
    return matchesSearch && matchesTier;
  });

  const handleAddCustomer = (e) => {
    e.preventDefault();
    if (!newCust.name || !newCust.email) return;
    const added = {
      id: `CUST-${100 + customers.length + 1}`,
      name: newCust.name,
      contact: newCust.contact || 'Direct Client',
      email: newCust.email,
      tier: newCust.tier,
      status: 'Active',
      spent: '$12,500',
      joined: new Date().toISOString().split('T')[0]
    };
    setCustomers([added, ...customers]);
    setShowAddModal(false);
    setNewCust({ name: '', contact: '', email: '', tier: 'Enterprise', status: 'Active', spent: '$0' });
  };

  return (
    <div>
      <div className="finora-page-title-row">
        <div>
          <h1 className="finora-page-title">Customer Portfolio</h1>
          <p className="finora-page-subtitle">Manage client organizations, account tiers, and contract statuses</p>
        </div>
        <div className="finora-action-group">
          <button
            type="button"
            className="finora-btn finora-btn-primary"
            onClick={() => setShowAddModal(true)}
          >
            <PlusIcon size={16} />
            <span>Add Customer</span>
          </button>
        </div>
      </div>

      <div className="finora-panel">
        <div className="finora-panel-header" style={{ flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 13, color: 'var(--finora-text-secondary)' }}>
              Showing {filtered.length} of {customers.length} Accounts
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div className="finora-tabs">
              <button
                type="button"
                className={`finora-tab-btn ${tierFilter === 'all' ? 'active' : ''}`}
                onClick={() => setTierFilter('all')}
              >
                All Tiers
              </button>
              <button
                type="button"
                className={`finora-tab-btn ${tierFilter === 'enterprise' ? 'active' : ''}`}
                onClick={() => setTierFilter('enterprise')}
              >
                Enterprise
              </button>
              <button
                type="button"
                className={`finora-tab-btn ${tierFilter === 'business' ? 'active' : ''}`}
                onClick={() => setTierFilter('business')}
              >
                Business
              </button>
              <button
                type="button"
                className={`finora-tab-btn ${tierFilter === 'startup' ? 'active' : ''}`}
                onClick={() => setTierFilter('startup')}
              >
                Startup
              </button>
            </div>
          </div>
        </div>

        <div className="finora-table-wrap">
          <table className="finora-table">
            <thead>
              <tr>
                <th>Customer ID</th>
                <th>Company Name</th>
                <th>Primary Contact</th>
                <th>Email Address</th>
                <th>Tier</th>
                <th>Total Spent</th>
                <th>Status</th>
                <th>Joined Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id}>
                  <td style={{ color: 'var(--finora-text-muted)', fontFamily: 'monospace' }}>{item.id}</td>
                  <td style={{ fontWeight: 600, color: 'var(--finora-text-primary)' }}>{item.name}</td>
                  <td>{item.contact}</td>
                  <td style={{ color: 'var(--finora-text-secondary)' }}>{item.email}</td>
                  <td>
                    <span
                      style={{
                        padding: '2px 8px',
                        borderRadius: 6,
                        fontSize: 11,
                        fontWeight: 600,
                        background: item.tier === 'Enterprise' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                        color: item.tier === 'Enterprise' ? 'var(--finora-primary)' : 'var(--finora-text-secondary)',
                        border: '1px solid var(--finora-border)'
                      }}
                    >
                      {item.tier}
                    </span>
                  </td>
                  <td style={{ fontWeight: 600, color: 'var(--finora-text-primary)' }}>{item.spent}</td>
                  <td>
                    <span className={`finora-status-pill ${item.status.toLowerCase()}`}>
                      {item.status}
                    </span>
                  </td>
                  <td style={{ color: 'var(--finora-text-muted)', fontSize: 12 }}>{item.joined}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Customer Modal */}
      {showAddModal && (
        <div className="finora-backdrop" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: 'var(--finora-bg-card)', border: '1px solid var(--finora-border)', borderRadius: 16, width: 440, padding: 24, boxShadow: '0 20px 40px rgba(0,0,0,0.6)' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: 18, color: 'var(--finora-text-primary)' }}>Register New Customer</h3>
            <form onSubmit={handleAddCustomer} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, color: 'var(--finora-text-secondary)', marginBottom: 4 }}>Company Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apex Global Corp"
                  value={newCust.name}
                  onChange={(e) => setNewCust({ ...newCust, name: e.target.value })}
                  style={{ width: '100%', background: 'var(--finora-bg-main)', border: '1px solid var(--finora-border)', borderRadius: 8, padding: '8px 12px', color: 'var(--finora-text-primary)', outline: 'none' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, color: 'var(--finora-text-secondary)', marginBottom: 4 }}>Contact Person</label>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={newCust.contact}
                  onChange={(e) => setNewCust({ ...newCust, contact: e.target.value })}
                  style={{ width: '100%', background: 'var(--finora-bg-main)', border: '1px solid var(--finora-border)', borderRadius: 8, padding: '8px 12px', color: 'var(--finora-text-primary)', outline: 'none' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, color: 'var(--finora-text-secondary)', marginBottom: 4 }}>Official Email</label>
                <input
                  type="email"
                  required
                  placeholder="contact@company.com"
                  value={newCust.email}
                  onChange={(e) => setNewCust({ ...newCust, email: e.target.value })}
                  style={{ width: '100%', background: 'var(--finora-bg-main)', border: '1px solid var(--finora-border)', borderRadius: 8, padding: '8px 12px', color: 'var(--finora-text-primary)', outline: 'none' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, color: 'var(--finora-text-secondary)', marginBottom: 4 }}>Account Tier</label>
                <select
                  value={newCust.tier}
                  onChange={(e) => setNewCust({ ...newCust, tier: e.target.value })}
                  style={{ width: '100%', background: 'var(--finora-bg-main)', border: '1px solid var(--finora-border)', borderRadius: 8, padding: '8px 12px', color: 'var(--finora-text-primary)', outline: 'none' }}
                >
                  <option value="Enterprise">Enterprise</option>
                  <option value="Business">Business</option>
                  <option value="Startup">Startup</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10 }}>
                <button
                  type="button"
                  className="finora-btn finora-btn-secondary"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="finora-btn finora-btn-primary"
                >
                  Save Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
