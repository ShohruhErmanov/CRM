import app from './src/app.js'
import { config } from './src/config/index.js'
import { closeDb, getDb } from './src/config/database.js'

getDb()

const server = app.listen(config.port, () => {
  console.log(`Finora serveri http://localhost:${config.port} manzilida ishlamoqda.`)
  console.log(`Maʼlumotlar bazasi: ${config.dbPath}`)
})

function shutdown() {
  server.close(() => {
    closeDb()
    process.exit(0)
  })
}

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)
