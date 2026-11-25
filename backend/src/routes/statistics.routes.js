import { Router } from 'express'
import { getStatisticsController } from '../controllers/statistics.controller.js'
import { wrap } from '../utils/wrap.js'

const router = Router()

router.get('/', wrap(getStatisticsController))

export default router
