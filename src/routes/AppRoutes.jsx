import { Link, Route, Routes } from 'react-router-dom'
import AppLayout from '../components/layout/AppLayout.jsx'
import Icon from '../components/common/Icon.jsx'
import Dashboard from '../pages/Dashboard/Dashboard.jsx'
import Departments from '../pages/Departments/Departments.jsx'
import Employees from '../pages/Employees/Employees.jsx'
import Positions from '../pages/Positions/Positions.jsx'
import Settings from '../pages/Settings/Settings.jsx'
import Statistics from '../pages/Statistics/Statistics.jsx'

function NotFound() {
  return (
    <div className="card not-found">
      <Icon name="search" size={30} />
      <h2>Sahifa topilmadi</h2>
      <p>So‘ralgan manzil mavjud emas.</p>
      <Link to="/" className="button button--primary">Boshqaruv paneliga qaytish</Link>
    </div>
  )
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="xodimlar" element={<Employees />} />
        <Route path="bolimlar" element={<Departments />} />
        <Route path="lavozimlar" element={<Positions />} />
        <Route path="statistika" element={<Statistics />} />
        <Route path="sozlamalar" element={<Settings />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
