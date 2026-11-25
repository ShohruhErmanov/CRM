function TaskModal({ onClose, onSubmit, employees }) {
  return (
    <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <form className="task-modal" onSubmit={onSubmit}>
        <div className="modal-header">
          <div><p className="eyebrow">YANGI VAZIFA</p><h2>Vazifa yaratish</h2></div>
          <button type="button" onClick={onClose}>×</button>
        </div>
        <label>Vazifa nomi<input name="title" required placeholder="Masalan: Dizaynni tasdiqlash" /></label>
        <label>Loyiha<input name="project" placeholder="Finora" /></label>
        <label>Masʼul xodim<select name="assigneeId">{employees.map((employee) => <option key={employee.id} value={employee.id}>{employee.name}</option>)}</select></label>
        <div className="form-row">
          <label>Status<select name="status"><option>Pending</option><option>In Progress</option><option>Completed</option></select></label>
          <label>Priority<select name="priority"><option>Low</option><option>Medium</option><option>High</option></select></label>
        </div>
        <label>Deadline<input name="due" placeholder="30 Nov" /></label>
        <button className="submit-button" type="submit">Vazifani yaratish</button>
      </form>
    </div>
  )
}

export default TaskModal
