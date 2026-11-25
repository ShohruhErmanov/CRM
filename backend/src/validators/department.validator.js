import { assertNoUnknownFields, textField } from './common.validator.js'

export function validateDepartmentPayload(body) {
  assertNoUnknownFields(body, ['name', 'description'])
  return {
    name: textField(body.name, 'Bo‘lim nomi', { min: 2, max: 80 }),
    description: textField(body.description, 'Tavsif', { min: 1, max: 500, required: false }),
  }
}
