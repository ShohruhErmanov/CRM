import * as service from '../services/position.service.js'
import { sendSuccess } from '../utils/response.js'

export const listPositions = (req, res) =>
  sendSuccess(res, service.listPositionsService(req.query))

export const getAllPositions = (req, res) =>
  sendSuccess(res, service.getAllPositions(req.query.department_id ? Number(req.query.department_id) : null))

export const getPosition = (req, res) =>
  sendSuccess(res, service.getPosition(req.params.id))

export const createPosition = (req, res) =>
  sendSuccess(res, service.createPositionService(req.body), 'Lavozim qo‘shildi.', 201)

export const updatePosition = (req, res) =>
  sendSuccess(res, service.updatePositionService(req.params.id, req.body), 'Lavozim maʼlumotlari yangilandi.')

export const deletePosition = (req, res) =>
  sendSuccess(res, service.deletePositionService(req.params.id), 'Lavozim o‘chirildi.')
