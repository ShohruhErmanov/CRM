import { sendError } from '../utils/response.js'

export function notFoundHandler(req, res) {
  sendError(res, 404, 'So‘ralgan manzil topilmadi.', 'MANZIL_TOPILMADI')
}

export function errorHandler(error, req, res, next) {
  if (res.headersSent) return next(error)

  if (error.name === 'AppError') {
    return sendError(res, error.statusCode, error.message, error.code, error.details)
  }

  if (error.name === 'MulterError') {
    const messages = {
      LIMIT_FILE_SIZE: 'Rasm hajmi 2 MB dan oshmasligi kerak.',
      LIMIT_FILE_COUNT: 'Faqat bitta rasm yuklash mumkin.',
      LIMIT_UNEXPECTED_FILE: 'Noto‘g‘ri rasm maydoni yuborildi.',
    }
    return sendError(res, 400, messages[error.code] || 'Rasm yuklashda xatolik yuz berdi.', 'RASM_XATOLIGI')
  }

  if (error.type === 'entity.parse.failed') {
    return sendError(res, 400, 'Yuborilgan maʼlumotlar noto‘g‘ri shaklda.', 'NOTOGRI_SO_ROV')
  }

  const constraint = String(error.code || '').startsWith('SQLITE_CONSTRAINT')
  if (constraint) {
    const foreignKey = String(error.code).includes('FOREIGNKEY')
    return sendError(
      res,
      409,
      foreignKey
        ? 'Bog‘liq maʼlumotlar mavjudligi sababli amal bajarib bo‘lmaydi.'
        : 'Bu maʼlumot allaqachon mavjud yoki noto‘g‘ri qiymat kiritilgan.',
      'MALUMOTLAR_ZIDDIYATI',
    )
  }

  console.error('[Finora] Kutilmagan xatolik:', error)
  return sendError(res, 500, 'Serverda xatolik yuz berdi. Iltimos, keyinroq urinib ko‘ring.', 'SERVER_XATOLIGI')
}
