import { Router } from 'express'
import departmentRoutes from './department.routes.js'
import employeeRoutes from './employee.routes.js'
import positionRoutes from './position.routes.js'
import statisticsRoutes from './statistics.routes.js'

const router = Router()

const healthCheck = (req, res) => res.json({ success: true, data: { holat: 'ishlamoqda' } })
router.get('/health', healthCheck)
router.get('/salomatlik', healthCheck)
router.use('/employees', employeeRoutes)
router.use('/departments', departmentRoutes)
router.use('/positions', positionRoutes)
router.use('/statistics', statisticsRoutes)

export default router
