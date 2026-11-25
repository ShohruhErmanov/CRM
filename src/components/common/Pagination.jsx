import Icon from './Icon.jsx'

function pageItems(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, index) => index + 1)
  const items = [1]
  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)
  if (start > 2) items.push('…')
  for (let page = start; page <= end; page += 1) items.push(page)
  if (end < total - 1) items.push('…')
  items.push(total)
  return items
}

export default function Pagination({ page, totalPages, total, limit, onPage, onLimit }) {
  if (!total) return null

  return (
    <div className="pagination">
      <div className="pagination__info">
        Jami <strong>{total}</strong> ta yozuv · Har sahifada
        <select value={limit} onChange={(event) => onLimit(Number(event.target.value))} aria-label="Har sahifadagi yozuvlar soni">
          {[10, 20, 50].map((size) => <option value={size} key={size}>{size}</option>)}
        </select>
      </div>
      <div className="pagination__controls">
        <button type="button" className="pagination__arrow" onClick={() => onPage(page - 1)} disabled={page <= 1} aria-label="Oldingi sahifa">
          <Icon name="chevronLeft" size={16} />
        </button>
        {pageItems(page, totalPages).map((item, index) =>
          item === '…' ? (
            <span className="pagination__dots" key={`dots-${index}`}>…</span>
          ) : (
            <button
              type="button"
              key={item}
              className={`pagination__page ${item === page ? 'is-active' : ''}`}
              onClick={() => onPage(item)}
              aria-label={`${item}-sahifa`}
            >
              {item}
            </button>
          ),
        )}
        <button type="button" className="pagination__arrow" onClick={() => onPage(page + 1)} disabled={page >= totalPages} aria-label="Keyingi sahifa">
          <Icon name="chevronRight" size={16} />
        </button>
      </div>
    </div>
  )
}
