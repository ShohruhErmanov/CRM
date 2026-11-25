import { useState } from 'react';
import { employeesList as initialEmployees } from '../mockData';
import { PlusIcon } from '../Icons';

export default function EmployeesView({ searchTerm = '' }) {
  const [employees] = useState(initialEmployees);
  const [deptFilter, setDeptFilter] = useState('all');

  const filtered = employees.filter(e => {
    const matchesSearch = e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          e.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          e.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = deptFilter === 'all' || e.department.toLowerCase() === deptFilter.toLowerCase();
    return matchesSearch && matchesDept;
  });

  return (
    <div>
      <div className="finora-page-title-row">
        <div>
          <h1 className="finora-page-title">Employees Directory</h1>
          <p className="finora-page-subtitle">Manage organization staff, roles, departments, and active project assignments</p>
        </div>
        <div className="finora-action-group">
          <button
            type="button"
            className="finora-btn finora-btn-primary"
            onClick={() => alert('New employee onboarding workflow initiated.')}
          >
            <PlusIcon size={16} />
            <span>Invite Team Member</span>
          </button>
        </div>
      </div>

      <div className="finora-panel">
        <div className="finora-panel-header" style={{ flexWrap: 'wrap', gap: 12 }}>
          <div>
            <span style={{ fontSize: 13, color: 'var(--finora-text-secondary)' }}>
              Total Active Employees: 184 ({filtered.length} shown)
            </span>
          </div>

          <div className="finora-tabs">
            <button
              type="button"
              className={`finora-tab-btn ${deptFilter === 'all' ? 'active' : ''}`}
              onClick={() => setDeptFilter('all')}
            >
              All Departments
            </button>
            <button
              type="button"
              className={`finora-tab-btn ${deptFilter === 'engineering' ? 'active' : ''}`}
              onClick={() => setDeptFilter('engineering')}
            >
              Engineering
            </button>
            <button
              type="button"
              className={`finora-tab-btn ${deptFilter === 'sales' ? 'active' : ''}`}
              onClick={() => setDeptFilter('sales')}
            >
              Sales
            </button>
            <button
              type="button"
              className={`finora-tab-btn ${deptFilter === 'security' ? 'active' : ''}`}
              onClick={() => setDeptFilter('security')}
            >
              Security
            </button>
          </div>
        </div>

        <div className="finora-table-wrap">
          <table className="finora-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Employee Name</th>
                <th>Role & Title</th>
                <th>Department</th>
                <th>Email</th>
                <th>Active Projects</th>
                <th>Office Location</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((emp) => (
                <tr key={emp.id}>
                  <td style={{ color: 'var(--finora-text-muted)', fontFamily: 'monospace' }}>{emp.id}</td>
                  <td style={{ fontWeight: 600, color: 'var(--finora-text-primary)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div className="finora-avatar" style={{ width: 28, height: 28, fontSize: 11 }}>
                        {emp.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span>{emp.name}</span>
                    </div>
                  </td>
                  <td>{emp.role}</td>
                  <td>
                    <span style={{ padding: '2px 8px', borderRadius: 6, fontSize: 11, background: 'var(--finora-bg-surface)', border: '1px solid var(--finora-border)', color: 'var(--finora-text-secondary)' }}>
                      {emp.department}
                    </span>
                  </td>
                  <td style={{ color: 'var(--finora-text-secondary)' }}>{emp.email}</td>
                  <td style={{ fontWeight: 600, color: 'var(--finora-primary)' }}>{emp.projects} Projects</td>
                  <td style={{ color: 'var(--finora-text-muted)' }}>{emp.location}</td>
                  <td>
                    <span className={`finora-status-pill ${emp.status.toLowerCase() === 'active' ? 'completed' : 'pending'}`}>
                      {emp.status}
                    </span>
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
