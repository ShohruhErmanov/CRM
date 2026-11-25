import fs from 'node:fs'
import path from 'node:path'
import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import { config } from './config/index.js'
import { errorHandler, notFoundHandler } from './middleware/error.middleware.js'
import apiRoutes from './routes/index.js'

const app = express()
const distDir = path.join(config.rootDir, 'dist')

app.disable('x-powered-by')
app.use(helmet({ crossOriginResourcePolicy: { policy: 'same-origin' } }))

// Only configured origins and genuine same-origin requests are allowed.
app.use((req, res, next) => {
  const sameOrigin = `${req.protocol}://${req.get('host')}`
  const corsMiddleware = cors({
    credentials: true,
    origin: (origin, callback) => {
      if (!origin || config.clientOrigins.includes('*')) return callback(null, true)
      const allowed = config.clientOrigins.includes(origin) || origin === sameOrigin
      return callback(null, allowed)
    },
  })
  corsMiddleware(req, res, next)
})

app.use(express.json({ limit: '1mb' }))
app.use(express.urlencoded({ extended: true, limit: '1mb' }))

app.use('/uploads', express.static(config.uploadDir, { fallthrough: true, maxAge: '1h' }))
app.use('/api', apiRoutes)
app.use('/api', notFoundHandler)

// In production the backend also serves the built client (single page app).
app.use((req, res, next) => {
  const indexFile = path.join(distDir, 'index.html')
  if (req.method === 'GET' && fs.existsSync(indexFile)) return res.sendFile(indexFile)
  return next()
})

app.use(notFoundHandler)
app.use(errorHandler)

export default app
