import { getDb } from '../config/database.js'

export function logActivity(db, entityType, entityId, action, description) {
  db.prepare(
    `INSERT INTO activity_logs (entity_type, entity_id, action, description)
     VALUES (:entityType, :entityId, :action, :description)`,
  ).run({ entityType, entityId, action, description })
}

export function listRecentActivity(limit = 8) {
  return getDb()
    .prepare('SELECT id, entity_type, entity_id, action, description, created_at FROM activity_logs ORDER BY created_at DESC, id DESC LIMIT :limit')
    .all({ limit })
    .map((row) => ({
      id: Number(row.id),
      entityType: row.entity_type,
      entityId: Number(row.entity_id),
      action: row.action,
      description: row.description,
      createdAt: row.created_at,
    }))
}
