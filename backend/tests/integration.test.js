import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { once } from 'node:events'

const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'finora-test-'))
process.env.DB_PATH = path.join(tempDir, 'finora-test.db')
process.env.UPLOAD_DIR = path.join(tempDir, 'uploads')
process.env.SEED_REFERENCE_DATA = 'false'
process.env.CLIENT_ORIGIN = 'http://localhost:5173'

const { default: app } = await import('../src/app.js')
const { closeDb, getDb } = await import('../src/config/database.js')

let server
let base
let uploadsDir = path.join(tempDir, 'uploads')

async function call(endpoint, { method = 'GET', body, form, headers = {} } = {}) {
  const options = { method, headers: { ...headers } }
  if (form) options.body = form
  else if (body !== undefined) {
    options.headers['Content-Type'] = 'application/json'
    options.body = JSON.stringify(body)
  }
  const response = await fetch(`${base}${endpoint}`, options)
  const json = await response.json()
  return { status: response.status, body: json, headers: response.headers }
}

const employeePayload = (overrides = {}) => ({
  firstName: 'Aziz',
  lastName: 'Karimov',
  phone: '+998901234567',
  email: 'aziz@example.uz',
  departmentId: 1,
  positionId: 1,
  hireDate: new Date().toISOString().slice(0, 10),
  salary: 5500000,
  ...overrides,
})

test.before(async () => {
  server = app.listen(0, '127.0.0.1')
  await once(server, 'listening')
  base = `http://127.0.0.1:${server.address().port}/api`
  getDb()
})

test.after(() => {
  closeDb()
  server.close()
  fs.rmSync(tempDir, { recursive: true, force: true })
})

test('server ishlayapti va bo‘sh bazada nol ko‘rsatkichlar qaytadi', async () => {
  const health = await call('/health')
  assert.equal(health.status, 200)
  assert.equal(health.body.success, true)

  const stats = await call('/statistics')
  assert.equal(stats.status, 200)
  assert.deepEqual(stats.body.data.totals, {
    totalEmployees: 0, activeEmployees: 0, blockedEmployees: 0,
    totalDepartments: 0, totalPositions: 0, totalSalary: 0,
  })
  assert.equal(stats.body.data.hiringTrend.length, 12)
  assert.equal(stats.body.data.recentEmployees.length, 0)
})

test('bo‘lim va lavozim yaratish, takroriy nom va noto‘g‘ri bog‘lanish nazorati', async () => {
  const department = await call('/departments', { method: 'POST', body: { name: 'IT', description: 'Dasturiy taʼminot' } })
  assert.equal(department.status, 201)
  assert.equal(department.body.data.name, 'IT')

  const marketing = await call('/departments', { method: 'POST', body: { name: 'Marketing', description: '' } })
  assert.equal(marketing.status, 201)

  const duplicate = await call('/departments', { method: 'POST', body: { name: 'it', description: '' } })
  assert.equal(duplicate.status, 409)
  assert.match(duplicate.body.error.message, /allaqachon mavjud/)

  const position = await call('/positions', { method: 'POST', body: { name: 'Dasturchi', departmentId: 1, description: '' } })
  assert.equal(position.status, 201)
  assert.equal(position.body.data.departmentName, 'IT')

  const manager = await call('/positions', { method: 'POST', body: { name: 'Menejer', departmentId: 2, description: '' } })
  assert.equal(manager.status, 201)

  const missingDepartment = await call('/positions', { method: 'POST', body: { name: 'Tahlilchi', departmentId: 999, description: '' } })
  assert.equal(missingDepartment.status, 400)
})

test('xodim qo‘shish va validatsiya', async () => {
  const created = await call('/employees', { method: 'POST', body: employeePayload() })
  assert.equal(created.status, 201)
  assert.equal(created.body.data.firstName, 'Aziz')
  assert.equal(created.body.data.status, 'active')
  assert.equal(created.body.data.departmentName, 'IT')
  assert.equal(created.body.data.phone, '+998901234567')

  const duplicateEmail = await call('/employees', { method: 'POST', body: employeePayload({ email: 'AZIZ@example.uz', phone: '+998901111111' }) })
  assert.equal(duplicateEmail.status, 409)
  assert.equal(duplicateEmail.body.error.code, 'ELEKTRON_POCHTA_TAKROR')

  const duplicatePhone = await call('/employees', { method: 'POST', body: employeePayload({ email: 'boshqa@example.uz', phone: '998901234567' }) })
  assert.equal(duplicatePhone.status, 409)
  assert.equal(duplicatePhone.body.error.code, 'TELEFON_TAKROR')

  const badPhone = await call('/employees', { method: 'POST', body: employeePayload({ phone: '123', email: 'yangi@example.uz' }) })
  assert.equal(badPhone.status, 400)

  const badEmail = await call('/employees', { method: 'POST', body: employeePayload({ email: 'noto_gri', phone: '+998907777777' }) })
  assert.equal(badEmail.status, 400)

  const wrongDepartment = await call('/employees', { method: 'POST', body: employeePayload({ email: 'x@example.uz', phone: '+998906666666', departmentId: 2, positionId: 1 }) })
  assert.equal(wrongDepartment.status, 400)
  assert.match(wrongDepartment.body.error.message, /bo‘limga tegishli emas/)

  const unknownField = await call('/employees', { method: 'POST', body: { ...employeePayload({ email: 'y@example.uz', phone: '+998905555555' }), extra: 1 } })
  assert.equal(unknownField.status, 400)
})

test('ro‘yxat, qidiruv, filtr, tartiblash va sahifalash', async () => {
  for (const item of [
    employeePayload({ firstName: 'Malika', lastName: 'Usmonova', email: 'malika@example.uz', phone: '+998901111222', salary: 7500000, departmentId: 2, positionId: 2 }),
    employeePayload({ firstName: 'Bobur', lastName: 'Aliyev', email: 'bobur@example.uz', phone: '+998901111333', salary: 4000000 }),
  ]) {
    const response = await call('/employees', { method: 'POST', body: item })
    assert.equal(response.status, 201)
  }

  const byName = await call('/employees?q=Malika')
  assert.equal(byName.body.data.total, 1)
  assert.equal(byName.body.data.items[0].firstName, 'Malika')

  const byPhone = await call('/employees?q=901111333')
  assert.equal(byPhone.body.data.total, 1)
  assert.equal(byPhone.body.data.items[0].firstName, 'Bobur')

  const byDepartment = await call('/employees?department_id=1')
  assert.equal(byDepartment.body.data.total, 2)

  const byPosition = await call('/employees?position_id=2')
  assert.equal(byPosition.body.data.total, 1)

  const byStatus = await call('/employees?status=active')
  assert.equal(byStatus.body.data.total, 3)

  const sorted = await call('/employees?sort_by=salary&sort_order=asc')
  assert.equal(sorted.body.data.items[0].salary, 4000000)

  const paged = await call('/employees?page=2&limit=2&sort_by=id&sort_order=asc')
  assert.equal(paged.body.data.items.length, 1)
  assert.equal(paged.body.data.totalPages, 2)
})

test('xodim maʼlumotlarini o‘qish va tahrirlash', async () => {
  const found = await call('/employees/1')
  assert.equal(found.status, 200)
  assert.equal(found.body.data.email, 'aziz@example.uz')

  const missing = await call('/employees/9999')
  assert.equal(missing.status, 404)

  const updated = await call('/employees/1', {
    method: 'PUT',
    body: employeePayload({ firstName: 'Azizbek', salary: 6200000, email: 'azizbek@example.uz' }),
  })
  assert.equal(updated.status, 200)
  assert.equal(updated.body.data.firstName, 'Azizbek')
  assert.equal(updated.body.data.salary, 6200000)
  assert.equal(updated.body.data.email, 'azizbek@example.uz')
})

test('faollashtirish va bloklash maʼlumotlarni o‘chirmaydi', async () => {
  const blocked = await call('/employees/1/status', { method: 'PATCH', body: { status: 'blocked' } })
  assert.equal(blocked.status, 200)
  assert.equal(blocked.body.data.status, 'blocked')

  const stats = await call('/statistics')
  assert.equal(stats.body.data.totals.blockedEmployees, 1)
  assert.equal(stats.body.data.totals.activeEmployees, 2)

  const active = await call('/employees/1/status', { method: 'PATCH', body: { status: 'active' } })
  assert.equal(active.status, 200)
  assert.equal(active.body.data.status, 'active')

  const sameStatus = await call('/employees/1/status', { method: 'PATCH', body: { status: 'active' } })
  assert.equal(sameStatus.status, 400)

  const invalidStatus = await call('/employees/1/status', { method: 'PATCH', body: { status: 'deleted' } })
  assert.equal(invalidStatus.status, 400)

  const details = await call('/employees/1')
  assert.equal(details.status, 200)
  assert.equal(details.body.data.firstName, 'Azizbek')
})

test('rasm yuklash, statik fayl va xavfsizlik tekshiruvi', async () => {
  const png = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d])
  const form = new FormData()
  Object.entries(employeePayload({
    firstName: 'Dilshod', lastName: 'Toshmatov', email: 'dilshod@example.uz', phone: '+998904444555',
  })).forEach(([key, value]) => form.append(key, String(value)))
  form.append('photo', new Blob([png], { type: 'image/png' }), 'rasm.png')

  const created = await call('/employees', { method: 'POST', form })
  assert.equal(created.status, 201)
  const photoPath = created.body.data.photoPath
  assert.match(photoPath, /^\/uploads\/[a-f0-9-]+\.png$/)

  const imageResponse = await fetch(`http://127.0.0.1:${server.address().port}${photoPath}`)
  assert.equal(imageResponse.status, 200)

  const invalidForm = new FormData()
  Object.entries(employeePayload({ email: 'noto_gri@example.uz', phone: '+998903333222' })).forEach(([key, value]) => invalidForm.append(key, String(value)))
  invalidForm.append('photo', new Blob([Buffer.from('not an image')], { type: 'text/plain' }), 'rasm.txt')
  const invalid = await call('/employees', { method: 'POST', form: invalidForm })
  assert.equal(invalid.status, 400)

  const tooLargeForm = new FormData()
  Object.entries(employeePayload({ email: 'katta@example.uz', phone: '+998902222111' })).forEach(([key, value]) => tooLargeForm.append(key, String(value)))
  tooLargeForm.append('photo', new Blob([Buffer.alloc(3 * 1024 * 1024, 1)], { type: 'image/png' }), 'katta.png')
  const tooLarge = await call('/employees', { method: 'POST', form: tooLargeForm })
  assert.equal(tooLarge.status, 400)

  const withPhotoId = created.body.data.id
  const removeForm = new FormData()
  const current = (await call(`/employees/${withPhotoId}`)).body.data
  Object.entries({
    firstName: current.firstName, lastName: current.lastName, phone: current.phone,
    email: current.email, departmentId: current.departmentId, positionId: current.positionId,
    hireDate: current.hireDate, salary: current.salary, removePhoto: 'true',
  }).forEach(([key, value]) => removeForm.append(key, String(value)))
  const removed = await call(`/employees/${withPhotoId}`, { method: 'PUT', form: removeForm })
  assert.equal(removed.status, 200)
  assert.equal(removed.body.data.photoPath, null)
  assert.equal(fs.existsSync(path.join(uploadsDir, path.basename(photoPath))), false)
})

test('bo‘lim va lavozim o‘chirishda bog‘liqlik himoyasi', async () => {
  const departmentWithEmployees = await call('/departments/1', { method: 'DELETE' })
  assert.equal(departmentWithEmployees.status, 409)
  assert.match(departmentWithEmployees.body.error.message, /nafar xodim mavjud/)

  const positionWithEmployees = await call('/positions/1', { method: 'DELETE' })
  assert.equal(positionWithEmployees.status, 409)
  assert.match(positionWithEmployees.body.error.message, /nafar xodim ishlaydi/)

  const emptyDepartment = await call('/departments', { method: 'POST', body: { name: 'Buxgalteriya', description: '' } })
  assert.equal(emptyDepartment.status, 201)
  const emptyPosition = await call('/positions', { method: 'POST', body: { name: 'Hisobchi', departmentId: emptyDepartment.body.data.id, description: '' } })
  assert.equal(emptyPosition.status, 201)
  const departmentWithPositions = await call(`/departments/${emptyDepartment.body.data.id}`, { method: 'DELETE' })
  assert.equal(departmentWithPositions.status, 409)
  assert.match(departmentWithPositions.body.error.message, /lavozim biriktirilgan/)
})

test('statistika haqiqiy maʼlumotlardan hisoblanadi', async () => {
  const stats = await call('/statistics')
  assert.equal(stats.body.data.totals.totalEmployees, 4)
  assert.equal(stats.body.data.totals.totalDepartments, 3)
  assert.equal(stats.body.data.totals.totalPositions, 3)
  assert.equal(stats.body.data.byDepartment.find((item) => item.name === 'IT').total, 3)
  assert.equal(stats.body.data.byPosition.find((item) => item.name === 'Dasturchi').total, 3)
  assert.equal(stats.body.data.hiringTrend.at(-1).month, new Date().toISOString().slice(0, 7))
  assert.equal(stats.body.data.hiringTrend.at(-1).total, 4)
  assert.ok(stats.body.data.recentActivity.length >= 5)
  assert.ok(stats.body.data.recentActivity.some((item) => /yangilandi/.test(item.description)))
})

test('bo‘lim va lavozim tahrirlash hamda o‘chirish', async () => {
  const department = await call('/departments/2', { method: 'PUT', body: { name: 'Savdo', description: 'Sotish bo‘limi' } })
  assert.equal(department.status, 200)
  assert.equal(department.body.data.name, 'Savdo')

  const position = await call('/positions/2', { method: 'PUT', body: { name: 'Sotuvchi', departmentId: 2, description: '' } })
  assert.equal(position.status, 200)
  assert.equal(position.body.data.name, 'Sotuvchi')

  const removeEmployee = await call('/employees/2', { method: 'DELETE' })
  assert.equal(removeEmployee.status, 200)
  const removePosition = await call('/positions/2', { method: 'DELETE' })
  assert.equal(removePosition.status, 200)
  const removeDepartment = await call('/departments/2', { method: 'DELETE' })
  assert.equal(removeDepartment.status, 200)

  const stats = await call('/statistics')
  assert.equal(stats.body.data.totals.totalEmployees, 3)
  assert.equal(stats.body.data.totals.totalPositions, 2)
  assert.equal(stats.body.data.totals.totalDepartments, 2)
})

test('CORS faqat ruxsat etilgan manbalarga javob beradi', async () => {
  const allowed = await call('/health', { headers: { Origin: 'http://localhost:5173' } })
  assert.equal(allowed.headers.get('access-control-allow-origin'), 'http://localhost:5173')

  const denied = await call('/health', { headers: { Origin: 'http://example.com' } })
  assert.equal(denied.headers.get('access-control-allow-origin'), null)
})

test('maʼlumotlar server qayta ishga tushganda saqlanadi', () => {
  closeDb()
  const db = getDb()
  const count = db.prepare('SELECT COUNT(*) AS total FROM employees').get().total
  assert.equal(Number(count), 3)
  const departments = db.prepare('SELECT COUNT(*) AS total FROM departments').get().total
  assert.equal(Number(departments), 2)
})
