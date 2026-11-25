import { Router } from 'express'
import * as controller from '../controllers/department.controller.js'
import { wrap } from '../utils/wrap.js'

const router = Router()

router.get('/', wrap(controller.listDepartments))
router.get('/all', wrap(controller.getAllDepartments))
router.get('/:id', wrap(controller.getDepartment))
router.post('/', wrap(controller.createDepartment))
router.put('/:id', wrap(controller.updateDepartment))
router.delete('/:id', wrap(controller.deleteDepartment))

export default router
