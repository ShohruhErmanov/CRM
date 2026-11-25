import { formatToday } from '../../utils/format.js'
import Icon from '../common/Icon.jsx'

export default function Topbar({ title, subtitle, onMenu }) {
  return (
    <header className="topbar">
      <div className="topbar__left">
        <button type="button" className="icon-button topbar__menu" onClick={onMenu} aria-label="Menyu ochish">
          <Icon name="menu" size={22} />
        </button>
        <div>
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>
      </div>
      <div className="topbar__date">
        <Icon name="calendar" size={16} />
        <span>{formatToday()}</span>
import Icon from '../common/Icon'

function Topbar({ query, onQueryChange, onOpenModal }) {
  return (
    <header className="topbar">
      <div className="search-box">
        <Icon name="search" size={19} />
        <input value={query} onChange={(event) => onQueryChange(event.target.value)} placeholder="Qidiruv..." />
      </div>
      <div className="top-actions">
        <button className="icon-button" aria-label="Bildirishnomalar"><Icon name="bell" /><span className="notification-dot" /></button>
        <button className="add-button" onClick={onOpenModal}><Icon name="plus" size={19} /> Yangi vazifa</button>
      </div>
    </header>
  )
}

export default Topbar
