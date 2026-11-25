import { useState } from 'react'
import Icon from '../common/Icon'

function TaskComments({ task, employees, onClose, onAddComment }) {
  const [text, setText] = useState('')
  const assignee = employees.find((employee) => employee.id === task.assigneeId)

  function submitComment(event) {
    event.preventDefault()
    const value = text.trim()
    if (!value) return
    onAddComment(task.id, value)
    setText('')
  }

  return (
    <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <aside className="comments-panel">
        <div className="comments-header">
          <div><p className="eyebrow">VAZIFA MUHOKAMASI</p><h2>{task.title}</h2></div>
          <button type="button" onClick={onClose} aria-label="Yopish">×</button>
        </div>
        <div className="comment-meta">
          <span>{task.project}</span>
          {assignee && <span>Masʼul: <b>{assignee.name}</b></span>}
        </div>
        <div className="comment-list">
          {task.comments?.length ? task.comments.map((comment) => (
            <div className="comment-item" key={comment.id}>
              <div className="comment-avatar">{comment.author.split(' ').map((word) => word[0]).join('').slice(0, 2)}</div>
              <div><div className="comment-author"><b>{comment.author}</b><time>{comment.time}</time></div><p>{comment.text}</p></div>
            </div>
          )) : <p className="empty-comments">Hozircha kommentlar yoʻq.</p>}
        </div>
        <form className="comment-form" onSubmit={submitComment}>
          <input value={text} onChange={(event) => setText(event.target.value)} placeholder="Komment yozing..." aria-label="Komment" />
          <button type="submit" aria-label="Yuborish"><Icon name="plus" size={18} /></button>
        </form>
      </aside>
    </div>
  )
}

export default TaskComments
