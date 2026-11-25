import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar.jsx'
import Topbar from './Topbar.jsx'

const titles = {
  '/': ['Boshqaruv paneli', 'Kompaniya faoliyatining umumiy ko‘rinishi'],
  '/xodimlar': ['Xodimlar', 'Xodimlar maʼlumotlarini boshqarish'],
  '/bolimlar': ['Bo‘limlar', 'Tashkiliy bo‘limlarni boshqarish'],
  '/lavozimlar': ['Lavozimlar', 'Lavozimlarni bo‘limlarga biriktirish'],
  '/statistika': ['Statistika', 'Xodimlar bo‘yicha batafsil tahlil'],
  '/sozlamalar': ['Sozlamalar', 'Tizim maʼlumotlari va vositalari'],
}

export default function AppLayout() {
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem('finora-sidebar') === 'collapsed')
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  const toggleCollapsed = () => {
    setCollapsed((current) => {
      const next = !current
      localStorage.setItem('finora-sidebar', next ? 'collapsed' : 'expanded')
      return next
    })
  }

  const [title, subtitle] = titles[location.pathname] || ['Finora', 'Xodimlarni boshqarish tizimi']

  return (
    <div className={`app-shell ${collapsed ? 'app-shell--collapsed' : ''}`}>
      <Sidebar
        collapsed={collapsed}
        onToggle={toggleCollapsed}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />
      <div className="app-shell__main">
        <Topbar title={title} subtitle={subtitle} onMenu={() => setMobileOpen(true)} />
        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
