import {
  DashboardIcon,
  CustomersIcon,
  EmployeesIcon,
  LeadsIcon,
  SalesIcon,
  AnalyticsIcon,
  ReportsIcon,
  SettingsIcon,
  ChevronRightIcon
} from '../Icons';

const navigationItems = [
  { id: 'dashboard', label: 'Dashboard', icon: DashboardIcon, category: 'Main' },
  { id: 'customers', label: 'Customers', icon: CustomersIcon, category: 'CRM & Ops', badge: '4.8k' },
  { id: 'employees', label: 'Employees', icon: EmployeesIcon, category: 'CRM & Ops', badge: '184' },
  { id: 'leads', label: 'Leads', icon: LeadsIcon, category: 'CRM & Ops', badge: 'New' },
  { id: 'sales', label: 'Sales', icon: SalesIcon, category: 'Financials' },
  { id: 'analytics', label: 'Analytics', icon: AnalyticsIcon, category: 'Financials' },
  { id: 'reports', label: 'Reports', icon: ReportsIcon, category: 'Financials' },
  { id: 'settings', label: 'Settings', icon: SettingsIcon, category: 'System' }
];

export default function Sidebar({
  activeNav,
  setActiveNav,
  isCollapsed,
  setIsCollapsed,
  mobileOpen,
  setMobileOpen
}) {
  const handleNavClick = (id) => {
    setActiveNav(id);
    if (mobileOpen) {
      setMobileOpen(false);
    }
  };

  // Group items by category
  const categories = ['Main', 'CRM & Ops', 'Financials', 'System'];

  return (
    <aside className={`finora-sidebar ${isCollapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
      {/* Brand Logo */}
      <div className="finora-sidebar-brand">
        <div className="finora-logo-area" onClick={() => handleNavClick('dashboard')}>
          <div className="finora-logo-mark">F</div>
          {!isCollapsed && (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span className="finora-logo-text">Finora</span>
              <span className="finora-logo-badge">CRM</span>
            </div>
          )}
        </div>
        {!isCollapsed && (
          <button
            type="button"
            className="finora-collapse-btn"
            onClick={() => setIsCollapsed(!isCollapsed)}
            title="Collapse Sidebar"
          >
            <ChevronRightIcon size={16} style={{ transform: 'rotate(180deg)' }} />
          </button>
        )}
      </div>

      {/* Nav Menu */}
      <nav className="finora-nav-menu">
        {categories.map((cat) => {
          const items = navigationItems.filter(item => item.category === cat);
          if (items.length === 0) return null;
          return (
            <div key={cat} style={{ marginBottom: 8 }}>
              {!isCollapsed && <div className="finora-nav-category">{cat}</div>}
              {items.map((item) => {
                const IconComponent = item.icon;
                const isActive = activeNav === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    className={`finora-nav-item ${isActive ? 'active' : ''}`}
                    onClick={() => handleNavClick(item.id)}
                    title={isCollapsed ? item.label : undefined}
                  >
                    <span className="finora-nav-icon">
                      <IconComponent size={19} />
                    </span>
                    {!isCollapsed && (
                      <span style={{ flex: 1, whiteSpace: 'nowrap' }}>{item.label}</span>
                    )}
                    {!isCollapsed && item.badge && (
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 600,
                          padding: '1px 6px',
                          borderRadius: 10,
                          background: item.badge === 'New' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255, 255, 255, 0.08)',
                          color: item.badge === 'New' ? '#3B82F6' : '#94A3B8'
                        }}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          );
        })}
      </nav>

      {/* Sidebar Footer */}
      {!isCollapsed ? (
        <div className="finora-sidebar-footer">
          <div className="finora-sidebar-footer-card">
            <div className="finora-plan-info">
              <span className="finora-plan-title">Finora Pro Suite</span>
              <span className="finora-plan-badge">Active</span>
            </div>
            <p style={{ fontSize: 11, color: 'var(--finora-text-muted)', margin: 0 }}>
              Cloud v3.4.1 • Enterprise
            </p>
          </div>
        </div>
      ) : (
        <div style={{ padding: '16px 8px', display: 'flex', justifyContent: 'center' }}>
          <button
            type="button"
            className="finora-collapse-btn"
            onClick={() => setIsCollapsed(false)}
            title="Expand Sidebar"
          >
            <ChevronRightIcon size={16} />
          </button>
        </div>
      )}
    </aside>
  );
}
