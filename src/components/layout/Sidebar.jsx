import { NavLink } from 'react-router-dom'
import Icon from '../common/Icon.jsx'

const navigation = [
  { to: '/', label: 'Boshqaruv paneli', icon: 'grid', end: true },
  { to: '/xodimlar', label: 'Xodimlar', icon: 'users' },
  { to: '/bolimlar', label: 'Bo‘limlar', icon: 'building' },
  { to: '/lavozimlar', label: 'Lavozimlar', icon: 'briefcase' },
  { to: '/statistika', label: 'Statistika', icon: 'chart' },
  { to: '/sozlamalar', label: 'Sozlamalar', icon: 'settings' },
]

export default function Sidebar({ collapsed, onToggle, mobileOpen, onMobileClose }) {
  return (
    <>
      {mobileOpen && <div className="sidebar-overlay" onClick={onMobileClose} />}
      <aside className={`sidebar ${collapsed ? 'sidebar--collapsed' : ''} ${mobileOpen ? 'sidebar--mobile-open' : ''}`}>
        <div className="sidebar__brand">
          <div className="brand-mark">F</div>
          <div className="brand-text">
            <strong>Finora</strong>
            <span>Xodimlarni boshqarish</span>
          </div>
          <button type="button" className="sidebar__mobile-close icon-button" onClick={onMobileClose} aria-label="Menyu yopish">
            <Icon name="close" size={20} />
          </button>
        </div>

        <nav className="sidebar__nav" aria-label="Asosiy menyu">
          <span className="sidebar__section-label">Menyular</span>
          {navigation.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={onMobileClose}
              title={collapsed ? item.label : undefined}
              className={({ isActive }) => `nav-link ${isActive ? 'is-active' : ''}`}
            >
              <Icon name={item.icon} size={20} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar__footer">
          <div className="sidebar__status">
            <span className="sidebar__status-dot" />
            <span>Tizim faol</span>
          </div>
          <button type="button" className="sidebar__collapse" onClick={onToggle} aria-label={collapsed ? 'Menyu kengaytirish' : 'Menyu toraytirish'}>
            <Icon name={collapsed ? 'chevronRight' : 'chevronLeft'} size={18} />
            <span>Menyuni toraytirish</span>
          </button>
        </div>
      </aside>
    </>
  )
}
import Icon from '../common/Icon'

const navItems = [
  ['grid', 'Bosh sahifa'],
  ['check', 'Vazifalar'],
  ['users', 'Xodimlar'],
  ['folder', 'Loyihalar'],
  ['chart', 'Hisobotlar'],
]

function Sidebar({ activeNav, onNavChange }) {
  return (
    <aside className="sidebar">
      <div className="brand"><div className="brand-mark">F</div><span>Finora</span></div>
      <nav className="nav-list">
        {navItems.map(([icon, label]) => (
          <button key={label} className={activeNav === label ? 'nav-item active' : 'nav-item'} onClick={() => onNavChange(label)}>
            <Icon name={icon} /><span>{label}</span>
          </button>
        ))}
      </nav>
      <button className="profile">
        <div className="avatar">SE</div>
        <div><strong>Shohruh Ermanov</strong><small>Administrator</small></div>
        <Icon name="dots" size={18} />
      </button>
    </aside>
  )
}

export default Sidebar
