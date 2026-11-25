import multer from 'multer'
import { config } from '../config/index.js'
import { AppError } from '../utils/app-error.js'

const allowedMimes = ['image/jpeg', 'image/png', 'image/webp']

const multerUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: config.maxPhotoSize, files: 1 },
  fileFilter: (req, file, callback) => {
    if (!allowedMimes.includes(file.mimetype)) {
      callback(new AppError(400, 'Faqat JPG, PNG yoki WEBP rasmlari qabul qilinadi.', 'NOTOGRI_FORMAT'))
      return
    }
    callback(null, true)
  },
}).single('photo')

function hasValidSignature(buffer) {
  if (!buffer || buffer.length < 12) return false
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) return true
  if (buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return true
  return buffer.toString('ascii', 0, 4) === 'RIFF' && buffer.toString('ascii', 8, 12) === 'WEBP'
}

export function uploadPhoto(req, res, next) {
  multerUpload(req, res, (error) => {
    if (error) return next(error)
    if (req.file && !hasValidSignature(req.file.buffer)) {
      return next(new AppError(400, 'Rasm fayli shikastlangan yoki noto‘g‘ri formatda.', 'NOTOGRI_RASM'))
    }
    return next()
  })
}
