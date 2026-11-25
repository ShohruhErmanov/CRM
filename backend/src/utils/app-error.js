export class AppError extends Error {
  constructor(statusCode, message, code = 'XATOLIK', details = []) {
    super(message)
    this.name = 'AppError'
    this.statusCode = statusCode
    this.code = code
    this.details = details
  }
}

export const badRequest = (message, details = []) =>
  new AppError(400, message, 'VALIDATSIA_XATOLIGI', details)

export const notFound = (message = 'So‘ralgan maʼlumot topilmadi.') =>
  new AppError(404, message, 'TOPILMADI')

export const conflict = (message, code = 'TAKRRORLANISH') =>
  new AppError(409, message, code)
