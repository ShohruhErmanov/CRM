function EmployeesPage({ employees, tasks, onUpdateTask }) {
  return (
    <section className="employees-page">
      <div className="page-heading">
        <div><p className="eyebrow">JAMOA / XODIMLAR</p><h1>Xodimlar</h1></div>
        <div className="heading-meta"><span>{employees.length} xodim</span></div>
      </div>
      <div className="employee-grid">
        {employees.map((employee) => {
          const employeeTasks = tasks.filter((task) => task.assigneeId === employee.id)
          return (
            <article className="employee-card" key={employee.id}>
              <header className="employee-header">
                <div className="employee-avatar">{employee.initials}</div>
                <div><h2>{employee.name}</h2><p>{employee.role}</p></div>
                <span className="employee-count">{employeeTasks.length}</span>
              </header>
              <div className="employee-task-list">
                {employeeTasks.length ? employeeTasks.map((task) => (
                  <div className="employee-task" key={task.id}>
                    <div><span className={`priority ${task.priority.toLowerCase()}`}>{task.priority}</span><b>{task.title}</b><small>{task.project} • {task.due}</small></div>
                    <select value={task.status} onChange={(event) => onUpdateTask(task.id, { status: event.target.value })} aria-label={`${task.title} holati`}>
                      <option>Pending</option><option>In Progress</option><option>Completed</option>
                    </select>
                  </div>
                )) : <p className="empty-employee-task">Biriktirilgan vazifa yoʻq</p>}
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}

export default EmployeesPage
