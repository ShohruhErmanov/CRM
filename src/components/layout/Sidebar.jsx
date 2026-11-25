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
