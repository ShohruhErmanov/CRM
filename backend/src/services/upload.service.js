import fs from 'node:fs'
import path from 'node:path'
import { randomUUID } from 'node:crypto'
import { config } from '../config/index.js'
import { badRequest } from '../utils/app-error.js'

const extensions = Object.freeze({
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
})

export function savePhoto(file) {
  if (!file) return null
  const extension = extensions[file.mimetype]
  if (!extension) {
    throw badRequest('Faqat JPG, PNG yoki WEBP rasmlari qabul qilinadi.', [
      { field: 'Xodim rasmi', message: 'Rasm formati noto‘g‘ri.' },
    ])
  }

  fs.mkdirSync(config.uploadDir, { recursive: true })
  const filename = `${randomUUID()}${extension}`
  fs.writeFileSync(path.join(config.uploadDir, filename), file.buffer, { flag: 'wx' })
  return `${config.publicUploadPrefix}/${filename}`
}

export function deletePhoto(photoPath) {
  if (!photoPath || !photoPath.startsWith(`${config.publicUploadPrefix}/`)) return
  const filename = path.basename(photoPath)
  if (photoPath !== `${config.publicUploadPrefix}/${filename}`) return
  try {
    fs.unlinkSync(path.join(config.uploadDir, filename))
  } catch (error) {
    if (error.code !== 'ENOENT') console.error('Rasmni o‘chirishda xatolik:', error.message)
  }
}
