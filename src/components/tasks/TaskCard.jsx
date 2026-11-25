import Icon from '../common/Icon'

function TaskCard({ task, employees, onOpenComments }) {
  const assignee = employees.find((employee) => employee.id === task.assigneeId)

  return (
    <article className="task-card">
      <div className="card-top">
        <span className={`priority ${task.priority.toLowerCase()}`}>{task.priority}</span>
        <button aria-label="Vazifa menyusi"><Icon name="dots" size={17} /></button>
      </div>
      <h3>{task.title}</h3>
      <p>{task.project}</p>
      {assignee && (
        <div className="card-assignee" title={assignee.name}>
          <span>{assignee.initials}</span><small>{assignee.name}</small>
        </div>
      )}
      <div className="card-footer">
        <span className="due"><Icon name="calendar" size={15} />{task.due}</span>
        <button className="comments" onClick={() => onOpenComments(task)} aria-label="Kommentlarni ochish"><Icon name="comment" size={15} />{task.comments?.length ?? 0}</button>
      </div>
    </article>
  )
}

export default TaskCard
