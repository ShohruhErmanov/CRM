import { useState } from 'react';
import { Menu, ShieldCheck, X } from 'lucide-react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { CRM_NAV_ITEMS } from '../app/navigation';
import { Avatar } from '../shared/components/ui';
import { cn } from '../shared/utils/cn';
import styles from './CrmLayout.module.css';

/**
 * Persistent Finora CRM shell shared across all team feature modules.
 */
export function CrmLayout({ customerCount = 0 }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const currentNav =
    CRM_NAV_ITEMS.find((item) => location.pathname.startsWith(item.path)) ||
    CRM_NAV_ITEMS[1];

  return (
    <div className={styles.shell}>
      {sidebarOpen && (
        <div
          className={styles.mobileBackdrop}
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(styles.sidebar, sidebarOpen && styles.sidebarOpen)}
        aria-label="Asosiy navigatsiya"
      >
        <div className={styles.brand}>
          <NavLink
            to="/customers"
            className={styles.brandLink}
            onClick={() => setSidebarOpen(false)}
          >
            <span className={styles.brandMark} aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M5 4H19V8.2H9.4V11.2H16.8V15.2H9.4V20.5H5V4Z" fill="#3B82F6" />
                <circle cx="18.2" cy="18.2" r="2.3" fill="#F1F5F9" />
              </svg>
            </span>
            <span className={styles.brandText}>
              <span className={styles.brandName}>Finora</span>
              <span className={styles.brandTag}>IT CRM Platform</span>
            </span>
          </NavLink>

          <button
            type="button"
            className={styles.mobileClose}
            onClick={() => setSidebarOpen(false)}
            aria-label="Menyuni yopish"
          >
            <X size={16} />
          </button>
        </div>

        <nav className={styles.nav}>
          <span className={styles.navSectionLabel}>CRM Modullari</span>
          {CRM_NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.id}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  cn(styles.navLink, isActive && styles.navLinkActive)
                }
              >
                <span className={styles.navMain}>
                  <Icon size={17} className={styles.navIcon} aria-hidden="true" />
                  <span className={styles.navLabel}>{item.label}</span>
                </span>
                {item.id === 'customers' ? (
                  <span className={cn(styles.navCount, 'tabular-nums')}>
                    {customerCount}
                  </span>
                ) : !item.ready ? (
                  <span className={styles.navSoon}>Rejada</span>
                ) : null}
              </NavLink>
            );
          })}
        </nav>

        <div className={styles.sidebarFooter}>
          <div className={styles.operatorCard}>
            <Avatar name="Finora Operator" size="sm" />
            <div className={styles.operatorMeta}>
              <p className={styles.operatorName}>Operator</p>
              <p className={styles.operatorShift}>
                <span className={styles.onlineDot} aria-hidden="true" />
                Faol smena
              </p>
            </div>
          </div>
        </div>
      </aside>

      <div className={styles.mainColumn}>
        <header className={styles.topbar}>
          <div className={styles.topbarLeft}>
            <button
              type="button"
              className={styles.menuButton}
              onClick={() => setSidebarOpen(true)}
              aria-label="Navigatsiyani ochish"
            >
              <Menu size={18} />
            </button>
            <div className={styles.crumb}>
              <span className={styles.crumbWorkspace}>Finora CRM</span>
              <span className={styles.crumbSep} aria-hidden="true">/</span>
              <span className={styles.crumbCurrent}>{currentNav.label}</span>
            </div>
          </div>

          <div className={styles.topbarRight}>
            <span className={styles.shiftBadge}>
              <ShieldCheck size={14} color="#3B82F6" aria-hidden="true" />
              IT &amp; Operator rejimi
            </span>
          </div>
        </header>

        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
