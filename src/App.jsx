import { useMemo, useState } from 'react'
import './App.css'
import Sidebar from './components/layout/Sidebar'
import Topbar from './components/layout/Topbar'
import KanbanBoard from './components/tasks/KanbanBoard'
import TaskModal from './components/tasks/TaskModal'
import TaskComments from './components/tasks/TaskComments'
import EmployeesPage from './components/employees/EmployeesPage'
import { employees, initialTasks, taskColumns } from './data/tasks'

function App() {
  const [tasks, setTasks] = useState(initialTasks)
  const [query, setQuery] = useState('')
  const [activeNav, setActiveNav] = useState('Vazifalar')
  const [showModal, setShowModal] = useState(false)
  const [selectedTaskId, setSelectedTaskId] = useState(null)

  const filteredTasks = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    if (!normalized) return tasks
    return tasks.filter((task) => `${task.title} ${task.project}`.toLowerCase().includes(normalized))
  }, [tasks, query])

  const selectedTask = tasks.find((task) => task.id === selectedTaskId)

  function addTask(event) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)

    setTasks((current) => [...current, {
      id: Date.now(),
      title: data.get('title'),
      project: data.get('project') || 'Finora',
      status: data.get('status'),
      priority: data.get('priority'),
      due: data.get('due') || '30 Nov',
      assigneeId: data.get('assigneeId'),
      comments: [],
    }])

    event.currentTarget.reset()
    setShowModal(false)
  }

  function updateTask(taskId, changes) {
    setTasks((current) => current.map((task) => task.id === taskId ? { ...task, ...changes } : task))
  }

  function addComment(taskId, text) {
    setTasks((current) => current.map((task) => task.id === taskId ? {
      ...task,
      comments: [...(task.comments || []), {
        id: Date.now(),
        author: 'Shohruh Ermanov',
        text,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }],
    } : task))
  }

  return (
    <div className="app-shell">
      <Sidebar activeNav={activeNav} onNavChange={setActiveNav} />

      <main className="main-content">
        <Topbar query={query} onQueryChange={setQuery} onOpenModal={() => setShowModal(true)} />

        {activeNav === 'Xodimlar' ? (
          <section className="content"><EmployeesPage employees={employees} tasks={tasks} onUpdateTask={updateTask} /></section>
        ) : (
          <section className="content">
            <div className="page-heading">
              <div><p className="eyebrow">LOYIHALAR / FINORA</p><h1>Vazifalar</h1></div>
              <div className="heading-meta">
                <span>{tasks.length} vazifa</span>
                <div className="member-stack"><b>SE</b><b>AK</b><b>+3</b></div>
              </div>
            </div>

            <KanbanBoard tasks={filteredTasks} columns={taskColumns} employees={employees} onOpenModal={() => setShowModal(true)} onOpenComments={(task) => setSelectedTaskId(task.id)} />
          </section>
        )}
      </main>

      {showModal && <TaskModal onClose={() => setShowModal(false)} onSubmit={addTask} employees={employees} />}
      {selectedTask && <TaskComments task={selectedTask} employees={employees} onClose={() => setSelectedTaskId(null)} onAddComment={addComment} />}
    </div>
  )
}

export default App
