import {
  CustomersIcon,
  EmployeesIcon,
  LeadsIcon,
  SalesIcon,
  TrendingUpIcon,
  TrendingDownIcon
} from '../Icons';

export default function StatCards({ stats, onCardClick }) {
  const cards = [
    {
      id: 'customers',
      key: 'customers',
      title: stats.customers.title,
      value: stats.customers.displayValue,
      change: stats.customers.change,
      isPositive: stats.customers.isPositive,
      comparison: stats.customers.comparisonText,
      detail: stats.customers.detail,
      icon: CustomersIcon,
      colorClass: 'stat-blue'
    },
    {
      id: 'employees',
      key: 'employees',
      title: stats.employees.title,
      value: stats.employees.displayValue,
      change: stats.employees.change,
      isPositive: stats.employees.isPositive,
      comparison: stats.employees.comparisonText,
      detail: stats.employees.detail,
      icon: EmployeesIcon,
      colorClass: 'stat-blue'
    },
    {
      id: 'leads',
      key: 'leads',
      title: stats.leads.title,
      value: stats.leads.displayValue,
      change: stats.leads.change,
      isPositive: stats.leads.isPositive,
      comparison: stats.leads.comparisonText,
      detail: stats.leads.detail,
      icon: LeadsIcon,
      colorClass: 'stat-blue'
    },
    {
      id: 'revenue',
      key: 'revenue',
      title: stats.revenue.title,
      value: stats.revenue.displayValue,
      change: stats.revenue.change,
      isPositive: stats.revenue.isPositive,
      comparison: stats.revenue.comparisonText,
      detail: stats.revenue.detail,
      icon: SalesIcon,
      colorClass: 'stat-green'
    }
  ];

  return (
    <div className="finora-stats-grid">
      {cards.map((card) => {
        const IconComponent = card.icon;
        return (
          <div
            key={card.id}
            className={`finora-stat-card ${card.colorClass}`}
            onClick={() => onCardClick && onCardClick(card.key)}
            style={{ cursor: onCardClick ? 'pointer' : 'default' }}
          >
            <div className="finora-stat-card-header">
              <div className="finora-stat-icon-wrap">
                <IconComponent size={22} />
              </div>
              <div className={`finora-stat-badge ${card.isPositive ? 'positive' : 'negative'}`}>
                {card.isPositive ? <TrendingUpIcon size={14} /> : <TrendingDownIcon size={14} />}
                <span>{card.isPositive ? `+${card.change}%` : `${card.change}%`}</span>
              </div>
            </div>

            <div className="finora-stat-title">{card.title}</div>
            <div className="finora-stat-value">{card.value}</div>

            <div className="finora-stat-footer">
              <span>{card.comparison}</span>
              <span style={{ color: card.isPositive ? 'var(--finora-success)' : 'var(--finora-text-secondary)', fontWeight: 500 }}>
                {card.detail}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
