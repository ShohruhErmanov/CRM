import fs from 'node:fs'
import path from 'node:path'
import { DatabaseSync } from 'node:sqlite'
import { config } from './index.js'
import { runSchema } from '../../database/migrate.js'

let connection

export function getDb() {
  if (!connection) {
    fs.mkdirSync(path.dirname(config.dbPath), { recursive: true })
    fs.mkdirSync(config.uploadDir, { recursive: true })
    connection = new DatabaseSync(config.dbPath)
    connection.exec('PRAGMA foreign_keys = ON')
    connection.exec('PRAGMA journal_mode = WAL')
    connection.exec('PRAGMA busy_timeout = 5000')
    runSchema(connection)
  }
  return connection
}

export function closeDb() {
  if (connection) {
    connection.close()
    connection = undefined
  }
}
