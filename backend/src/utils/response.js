export function sendSuccess(res, data = null, message = null, statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    ...(message ? { message } : {}),
    data,
  })
}

export function sendError(res, statusCode, message, code = 'XATOLIK', details = []) {
  return res.status(statusCode).json({
    success: false,
    error: { code, message, details },
  })
}
