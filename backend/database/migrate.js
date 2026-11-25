import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { config } from '../src/config/index.js'

const schemaPath = path.join(path.dirname(fileURLToPath(import.meta.url)), 'schema.sql')

const referenceDepartments = [
  { name: 'IT', description: 'Axborot texnologiyalari va dasturiy taʼminot', positions: ['Dasturchi', 'Dizayner', 'Tahlilchi'] },
  { name: 'Marketing', description: 'Brend, reklama va mijozlar bilan aloqa', positions: ['Menejer', 'Mutaxassis'] },
  { name: 'Moliya', description: 'Buxgalteriya va moliyaviy hisobot', positions: ['Hisobchi'] },
  { name: 'Kadrlar bo‘limi', description: 'Xodimlar bilan ishlash va yollash', positions: ['Mutaxassis'] },
  { name: 'Savdo', description: 'Sotish va mijozlarga xizmat ko‘rsatish', positions: ['Menejer'] },
  { name: 'Boshqaruv', description: 'Kompaniya boshqaruvi va strategiya', positions: ['Direktor'] },
]

export function runSchema(db) {
  db.exec(fs.readFileSync(schemaPath, 'utf8'))

  if (!config.seedReferenceData) return

  const alreadySeeded = db
    .prepare('SELECT value FROM app_meta WHERE key = :key')
    .get({ key: 'reference_data_seeded' })

  if (alreadySeeded) return

  db.exec('BEGIN')
  try {
    const insertDepartment = db.prepare(
      'INSERT INTO departments (name, description) VALUES (:name, :description)',
    )
    const insertPosition = db.prepare(
      'INSERT INTO positions (name, department_id, description) VALUES (:name, :department_id, :description)',
    )

    for (const department of referenceDepartments) {
      const result = insertDepartment.run({
        name: department.name,
        description: department.description,
      })
      const departmentId = Number(result.lastInsertRowid)
      for (const position of department.positions) {
        insertPosition.run({
          name: position,
          department_id: departmentId,
          description: `${position} lavozimi`,
        })
      }
    }

    db.prepare('INSERT INTO app_meta (key, value) VALUES (:key, :value)').run({
      key: 'reference_data_seeded',
      value: new Date().toISOString(),
    })
    db.exec('COMMIT')
  } catch (error) {
    db.exec('ROLLBACK')
    throw error
  }
}
