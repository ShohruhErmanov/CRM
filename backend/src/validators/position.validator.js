import { assertNoUnknownFields, idField, textField } from './common.validator.js'

export function validatePositionPayload(body) {
  assertNoUnknownFields(body, ['name', 'departmentId', 'description'])
  return {
    name: textField(body.name, 'Lavozim nomi', { min: 2, max: 80 }),
    departmentId: idField(body.departmentId, 'Bo‘lim'),
    description: textField(body.description, 'Tavsif', { min: 1, max: 500, required: false }),
  }
}
