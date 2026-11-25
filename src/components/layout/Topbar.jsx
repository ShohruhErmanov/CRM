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
      </div>
    </header>
  )
}
