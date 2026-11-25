import Icon from '../common/Icon'
import TaskCard from './TaskCard'

const columnLabels = {
  Pending: 'Kutilmoqda',
  'In Progress': 'Jarayonda',
  Completed: 'Bajarilgan',
}

function KanbanBoard({ tasks, columns, onOpenModal, employees, onOpenComments }) {
  return (
    <div className="board">
      {columns.map((column) => {
        const columnTasks = tasks.filter((task) => task.status === column)

        return (
          <section className="board-column" key={column}>
            <div className="column-header">
              <div>
                <span className={`status-dot ${column.replace(' ', '-').toLowerCase()}`} />
                <h2>{columnLabels[column]}</h2>
                <b>{columnTasks.length}</b>
              </div>
              <button aria-label="Koʻproq"><Icon name="dots" size={17} /></button>
            </div>
            <div className="task-list">
              {columnTasks.map((task) => <TaskCard key={task.id} task={task} employees={employees} onOpenComments={onOpenComments} />)}
              <button className="column-add" onClick={onOpenModal}><Icon name="plus" size={17} /> Vazifa qoʻshish</button>
            </div>
          </section>
        )
      })}
    </div>
  )
}

export default KanbanBoard
