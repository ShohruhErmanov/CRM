import StatCards from '../components/StatCards';
import SalesChart from '../components/SalesChart';
import MonthlyStats from '../components/MonthlyStats';
import RecentActivities from '../components/RecentActivities';
import AnalyticsReports from '../components/AnalyticsReports';
import { initialStatsData } from '../mockData';
import { RefreshIcon, PlusIcon } from '../Icons';

export default function DashboardOverview({ setActiveNav }) {
  const handleStatCardClick = (statKey) => {
    if (statKey === 'customers') setActiveNav('customers');
    else if (statKey === 'employees') setActiveNav('employees');
    else if (statKey === 'leads') setActiveNav('leads');
    else if (statKey === 'revenue') setActiveNav('sales');
  };

  return (
    <div>
      {/* Page Title & Quick Actions */}
      <div className="finora-page-title-row">
        <div>
          <h1 className="finora-page-title">Executive Dashboard</h1>
          <p className="finora-page-subtitle">
            Enterprise performance metrics, live CRM telemetry, and revenue forecasting
          </p>
        </div>

        <div className="finora-action-group">
          <button
            type="button"
            className="finora-btn finora-btn-secondary"
            onClick={() => window.location.reload()}
            title="Refresh Realtime Telemetry"
          >
            <RefreshIcon size={14} />
            <span>Sync</span>
          </button>

          <button
            type="button"
            className="finora-btn finora-btn-primary"
            onClick={() => setActiveNav('customers')}
          >
            <PlusIcon size={16} />
            <span>Quick Add</span>
          </button>
        </div>
      </div>

      {/* Sections 1, 2, 3, 4: Premium Statistics Cards */}
      <StatCards
        stats={initialStatsData}
        onCardClick={handleStatCardClick}
      />

      {/* Sections 5 & 6: Sales Chart & Monthly Statistics */}
      <div className="finora-analytics-row">
        <SalesChart />
        <MonthlyStats />
      </div>

      {/* Sections 7 & 8: Recent Activities & Analytics Reports */}
      <div className="finora-secondary-row">
        <RecentActivities />
        <AnalyticsReports />
      </div>
    </div>
  );
}
