import * as service from '../services/employee.service.js'
import { sendSuccess } from '../utils/response.js'

export const listEmployees = (req, res) =>
  sendSuccess(res, service.listEmployees(req.query))

export const getEmployee = (req, res) =>
  sendSuccess(res, service.getEmployee(req.params.id))

export const createEmployee = (req, res) =>
  sendSuccess(res, service.createEmployee(req.body, req.file), 'Xodim muvaffaqiyatli qo‘shildi.', 201)

export const updateEmployee = (req, res) =>
  sendSuccess(res, service.updateEmployee(req.params.id, req.body, req.file), 'Xodim maʼlumotlari yangilandi.')

export const updateEmployeeStatus = (req, res) =>
  sendSuccess(res, service.updateEmployeeStatus(req.params.id, req.body.status), 'Xodim holati yangilandi.')

export const deleteEmployee = (req, res) =>
  sendSuccess(res, service.deleteEmployee(req.params.id), 'Xodim o‘chirildi.')
