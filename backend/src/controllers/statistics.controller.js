import { getStatistics } from '../services/statistics.service.js'
import { sendSuccess } from '../utils/response.js'

export const getStatisticsController = (req, res) =>
  sendSuccess(res, getStatistics())
