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
