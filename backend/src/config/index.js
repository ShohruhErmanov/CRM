import path from 'node:path'
import { fileURLToPath } from 'node:url'
import dotenv from 'dotenv'

const backendDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const rootDir = path.resolve(backendDir, '..')

dotenv.config({ path: path.join(backendDir, '.env'), quiet: true })

function resolveProjectPath(value, fallback) {
  const target = value || fallback
  return path.isAbsolute(target) ? target : path.resolve(rootDir, target)
}

const origins = (process.env.CLIENT_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean)

export const config = Object.freeze({
  env: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 4000,
  rootDir,
  backendDir,
  dbPath: resolveProjectPath(process.env.DB_PATH, 'backend/database/finora.db'),
  uploadDir: resolveProjectPath(process.env.UPLOAD_DIR, 'backend/uploads'),
  maxPhotoSize: Number(process.env.MAX_PHOTO_SIZE) || 2 * 1024 * 1024,
  clientOrigins: origins,
  seedReferenceData: process.env.SEED_REFERENCE_DATA !== 'false',
  publicUploadPrefix: '/uploads',
})
