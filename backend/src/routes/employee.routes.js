import { Router } from 'express'
import * as controller from '../controllers/employee.controller.js'
import { uploadPhoto } from '../middleware/upload.middleware.js'
import { wrap } from '../utils/wrap.js'

const router = Router()

router.get('/', wrap(controller.listEmployees))
router.get('/:id', wrap(controller.getEmployee))
router.post('/', uploadPhoto, wrap(controller.createEmployee))
router.put('/:id', uploadPhoto, wrap(controller.updateEmployee))
router.patch('/:id/status', wrap(controller.updateEmployeeStatus))
router.delete('/:id', wrap(controller.deleteEmployee))

export default router
