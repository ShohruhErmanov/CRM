import { Router } from 'express'
import * as controller from '../controllers/position.controller.js'
import { wrap } from '../utils/wrap.js'

const router = Router()

router.get('/', wrap(controller.listPositions))
router.get('/all', wrap(controller.getAllPositions))
router.get('/:id', wrap(controller.getPosition))
router.post('/', wrap(controller.createPosition))
router.put('/:id', wrap(controller.updatePosition))
router.delete('/:id', wrap(controller.deletePosition))

export default router
