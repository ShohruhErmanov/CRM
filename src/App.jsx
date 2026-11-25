import { useMemo, useState } from 'react'
import './App.css'
import Sidebar from './components/layout/Sidebar'
import Topbar from './components/layout/Topbar'
import KanbanBoard from './components/tasks/KanbanBoard'
import TaskModal from './components/tasks/TaskModal'
import TaskComments from './components/tasks/TaskComments'
import EmployeesPage from './components/employees/EmployeesPage'
import { employees, initialTasks, taskColumns } from './data/tasks'

const Icon = ({ name, size = 20 }) => {
  const paths = {
    grid: '<rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
    chart: '<path d="M3 3v18h18"/><path d="m7 16 4-5 4 3 5-7"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
    history: '<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5M12 7v5l3 2"/>',
    settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-1.42 1.42-.06-.06A1.7 1.7 0 0 0 16.4 18a1.7 1.7 0 0 0-1 .6l-.08.1V21h-2v-2.3l-.08-.1A1.7 1.7 0 0 0 12 18a1.7 1.7 0 0 0-1.88.34l-.06.06-1.42-1.42.06-.06A1.7 1.7 0 0 0 9 14.6a1.7 1.7 0 0 0-.6-1l-.1-.08H6v-2h2.3l.1-.08A1.7 1.7 0 0 0 9 10a1.7 1.7 0 0 0-.34-1.88l-.06-.06L10.02 6.6l.06.06A1.7 1.7 0 0 0 12 7a1.7 1.7 0 0 0 1-.6l.08-.1V4h2v2.3l.08.1A1.7 1.7 0 0 0 16 7a1.7 1.7 0 0 0 1.88-.34l.06-.06 1.42 1.42-.06.06A1.7 1.7 0 0 0 19 10a1.7 1.7 0 0 0 .6 1l.1.08H22v2h-2.3l-.1.08A1.7 1.7 0 0 0 19 15Z"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
    bell: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
    arrow: '<path d="m9 18 6-6-6-6"/>',
  }
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" dangerouslySetInnerHTML={{ __html: paths[name] }} />
}

const initialLeads = [
  { id: 1, name: 'Aziz Karimov', company: 'NovaTech', phone: '+998 90 123 45 67', status: 'Yangi', value: 8500, date: '25 noy, 10:30' },
  { id: 2, name: 'Madina Aliyeva', company: 'Orion Studio', phone: '+998 99 456 78 90', status: 'Bogʻlangan', value: 5200, date: '24 noy, 16:15' },
  { id: 3, name: 'Bekzod Rahimov', company: 'Asaka Auto', phone: '+998 91 765 43 21', status: 'Qiziqdi', value: 12000, date: '24 noy, 11:40' },
  { id: 4, name: 'Dilnoza Saidova', company: 'Green Market', phone: '+998 93 234 56 78', status: 'Aylantirildi', value: 6800, date: '23 noy, 14:20' },
]

const statusClass = { Yangi: 'new', 'Bogʻlangan': 'contacted', Qiziqdi: 'interested', Aylantirildi: 'converted', Yoʻqotildi: 'lost' }

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
