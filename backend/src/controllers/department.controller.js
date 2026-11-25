import * as service from '../services/department.service.js'
import { sendSuccess } from '../utils/response.js'

export const listDepartments = (req, res) =>
  sendSuccess(res, service.listDepartmentsService(req.query))

export const getAllDepartments = (req, res) =>
  sendSuccess(res, service.getAllDepartments())

export const getDepartment = (req, res) =>
  sendSuccess(res, service.getDepartment(req.params.id))

export const createDepartment = (req, res) =>
  sendSuccess(res, service.createDepartmentService(req.body), 'Bo‘lim qo‘shildi.', 201)

export const updateDepartment = (req, res) =>
  sendSuccess(res, service.updateDepartmentService(req.params.id, req.body), 'Bo‘lim maʼlumotlari yangilandi.')

export const deleteDepartment = (req, res) =>
  sendSuccess(res, service.deleteDepartmentService(req.params.id), 'Bo‘lim o‘chirildi.')
