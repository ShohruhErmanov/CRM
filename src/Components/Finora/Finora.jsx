import { useState } from 'react';
import './Finora.css';

import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardOverview from './views/DashboardOverview';
import CustomersView from './views/CustomersView';
import EmployeesView from './views/EmployeesView';
import LeadsView from './views/LeadsView';
import SalesView from './views/SalesView';
import AnalyticsReports from './components/AnalyticsReports';
import SettingsView from './views/SettingsView';

import { initialNotifications } from './mockData';

export default function Finora() {
  const [activeNav, setActiveNav] = useState('dashboard');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [notifications, setNotifications] = useState(initialNotifications);

  // Router-like view selector
  const renderActiveView = () => {
    switch (activeNav) {
      case 'dashboard':
        return <DashboardOverview setActiveNav={setActiveNav} searchTerm={searchTerm} />;
      case 'customers':
        return <CustomersView searchTerm={searchTerm} />;
      case 'employees':
        return <EmployeesView searchTerm={searchTerm} />;
      case 'leads':
        return <LeadsView searchTerm={searchTerm} />;
      case 'sales':
        return <SalesView searchTerm={searchTerm} />;
      case 'analytics':
      case 'reports':
        return (
          <div>
            <div className="finora-page-title-row">
              <div>
                <h1 className="finora-page-title">
                  {activeNav === 'analytics' ? 'Deep Analytics & Metrics' : 'Executive Business Reports'}
                </h1>
                <p className="finora-page-subtitle">
                  Comprehensive quantitative analysis, forecast modeling, and report generation
                </p>
              </div>
            </div>
            <AnalyticsReports />
          </div>
        );
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardOverview setActiveNav={setActiveNav} searchTerm={searchTerm} />;
    }
  };

  return (
    <div className="finora-wrapper">
      {/* Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div
          className="finora-backdrop"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Collapsible / Mobile Responsive Sidebar */}
      <Sidebar
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main Container */}
      <div className={`finora-main-container ${isCollapsed ? 'sidebar-collapsed' : ''}`}>
        {/* Sticky Header */}
        <Header
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          notifications={notifications}
          setNotifications={setNotifications}
          toggleMobileSidebar={() => setMobileOpen(!mobileOpen)}
          setActiveNav={setActiveNav}
        />

        {/* Dynamic Page Content */}
        <main className="finora-content">
          {renderActiveView()}
        </main>
      </div>
    </div>
  );
}
