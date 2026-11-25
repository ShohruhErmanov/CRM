import { useState, useRef, useEffect } from 'react';
import {
  SearchIcon,
  BellIcon,
  MenuIcon,
  CalendarIcon,
  ChevronDownIcon,
  UserIcon,
  SettingsIcon,
  LogOutIcon,
  ShieldIcon,
  CloseIcon
} from '../Icons';

export default function Header({
  searchTerm,
  setSearchTerm,
  notifications,
  setNotifications,
  toggleMobileSidebar,
  setActiveNav
}) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const notifRef = useRef(null);
  const profileRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => n.unread).length;

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const clearNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Format today's date: e.g. "Wednesday, 25 Nov 2026"
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date());

  return (
    <header className="finora-header">
      {/* Left section: mobile toggle and search */}
      <div className="finora-header-left">
        <button
          type="button"
          className="finora-mobile-toggle"
          onClick={toggleMobileSidebar}
          aria-label="Toggle navigation"
        >
          <MenuIcon size={20} />
        </button>

        <div className="finora-search-bar">
          <SearchIcon className="finora-search-icon" size={17} />
          <input
            type="text"
            className="finora-search-input"
            placeholder="Search customers, leads, reports..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Right section: date, notifications, user profile */}
      <div className="finora-header-right">
        {/* Current Date */}
        <div className="finora-date-display">
          <CalendarIcon size={15} />
          <span>{formattedDate}</span>
        </div>

        {/* Notifications Dropdown */}
        <div style={{ position: 'relative' }} ref={notifRef}>
          <button
            type="button"
            className="finora-icon-button"
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
            title="Notifications"
            aria-label="Notifications"
          >
            <BellIcon size={19} />
            {unreadCount > 0 && <span className="finora-badge-dot" />}
          </button>

          {showNotifications && (
            <div className="finora-dropdown-menu">
              <div className="finora-dropdown-header">
                <span>Notifications ({notifications.length})</span>
                {unreadCount > 0 && (
                  <button
                    type="button"
                    className="finora-dropdown-action"
                    onClick={markAllAsRead}
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="finora-dropdown-list">
                {notifications.length === 0 ? (
                  <div style={{ padding: '24px 16px', textAlign: 'center', color: 'var(--finora-text-muted)', fontSize: 13 }}>
                    No new notifications
                  </div>
                ) : (
                  notifications.map((item) => (
                    <div
                      key={item.id}
                      className={`finora-dropdown-item ${item.unread ? 'unread' : ''}`}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--finora-text-primary)' }}>
                          {item.title}
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            clearNotification(item.id);
                          }}
                          style={{ background: 'transparent', border: 'none', color: 'var(--finora-text-muted)', cursor: 'pointer', padding: 2 }}
                        >
                          <CloseIcon size={14} />
                        </button>
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--finora-text-secondary)', lineHeight: 1.35, marginBottom: 4 }}>
                        {item.message}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--finora-text-muted)' }}>
                        {item.time}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div style={{ position: 'relative' }} ref={profileRef}>
          <div
            className="finora-profile-trigger"
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
          >
            <div className="finora-avatar">AK</div>
            <div className="finora-profile-info">
              <span className="finora-profile-name">Abbos Kudratov</span>
              <span className="finora-profile-role">Admin Architect</span>
            </div>
            <ChevronDownIcon size={14} style={{ color: 'var(--finora-text-muted)', marginRight: 4 }} />
          </div>

          {showProfileMenu && (
            <div className="finora-dropdown-menu" style={{ width: 220 }}>
              <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--finora-border)' }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--finora-text-primary)' }}>
                  Abbos Kudratov
                </div>
                <div style={{ fontSize: 11, color: 'var(--finora-text-muted)' }}>
                  abbos@finoracrm.io
                </div>
              </div>

              <div style={{ padding: '6px 0' }}>
                <button
                  type="button"
                  className="finora-dropdown-link"
                  onClick={() => {
                    setActiveNav('settings');
                    setShowProfileMenu(false);
                  }}
                >
                  <UserIcon size={16} />
                  <span>Account Profile</span>
                </button>
                <button
                  type="button"
                  className="finora-dropdown-link"
                  onClick={() => {
                    setActiveNav('settings');
                    setShowProfileMenu(false);
                  }}
                >
                  <SettingsIcon size={16} />
                  <span>Platform Settings</span>
                </button>
                <button
                  type="button"
                  className="finora-dropdown-link"
                  onClick={() => {
                    setActiveNav('analytics');
                    setShowProfileMenu(false);
                  }}
                >
                  <ShieldIcon size={16} />
                  <span>Security & Audits</span>
                </button>
                <div style={{ height: 1, background: 'var(--finora-border)', margin: '6px 0' }} />
                <button
                  type="button"
                  className="finora-dropdown-link danger"
                  onClick={() => {
                    alert('Finora Session: You are safely logged in as Administrator.');
                    setShowProfileMenu(false);
                  }}
                >
                  <LogOutIcon size={16} />
                  <span>Lock Session</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
