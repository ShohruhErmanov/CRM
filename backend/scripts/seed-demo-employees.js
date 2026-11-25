// Demo xodimlarni haqiqiy API orqali bazaga qo‘shadi (qayta ishga tushirish xavfsiz).
const API = process.env.API_URL || 'http://localhost:4000/api'

async function json(endpoint, options) {
  const response = await fetch(`${API}${endpoint}`, options)
  const body = await response.json()
  return { ok: response.ok, status: response.status, body }
}

const demo = [
  ['Aziz', 'Karimov', '+998901000001', 'aziz.karimov@finora.uz', 'IT', 'Dasturchi', 8500000, '2024-01-15', 'active'],
  ['Malika', 'Usmonova', '+998901000002', 'malika.usmonova@finora.uz', 'IT', 'Dasturchi', 9200000, '2024-03-02', 'active'],
  ['Dilshod', 'Toshmatov', '+998901000003', 'dilshod.toshmatov@finora.uz', 'IT', 'Dizayner', 6800000, '2024-05-20', 'active'],
  ['Nodira', 'Rahmatova', '+998901000004', 'nodira.rahmatova@finora.uz', 'IT', 'Tahlilchi', 7400000, '2024-08-11', 'blocked'],
  ['Bobur', 'Aliyev', '+998901000005', 'bobur.aliyev@finora.uz', 'Boshqaruv', 'Direktor', 18000000, '2023-06-01', 'active'],
  ['Gulnora', 'Saidova', '+998901000006', 'gulnora.saidova@finora.uz', 'Kadrlar bo‘limi', 'Mutaxassis', 6200000, '2024-02-14', 'active'],
  ['Jasur', 'Ergashev', '+998901000007', 'jasur.ergashev@finora.uz', 'Kadrlar bo‘limi', 'Mutaxassis', 5900000, '2024-09-03', 'active'],
  ['Sevara', 'Xolmatova', '+998901000008', 'sevara.xolmatova@finora.uz', 'Marketing', 'Menejer', 7700000, '2023-11-22', 'active'],
  ['Rustam', 'Nazarov', '+998901000009', 'rustam.nazarov@finora.uz', 'Marketing', 'Mutaxassis', 5500000, '2024-04-17', 'blocked'],
  ['Diyor', 'Qodirov', '+998901000010', 'diyor.qodirov@finora.uz', 'Savdo', 'Menejer', 7100000, '2024-06-09', 'active'],
  ['Shaxnoza', 'Mamatova', '+998901000011', 'shaxnoza.mamatova@finora.uz', 'Savdo', 'Menejer', 6600000, '2025-01-13', 'active'],
  ['Otabek', 'Yusupov', '+998901000012', 'otabek.yusupov@finora.uz', 'Moliya', 'Hisobchi', 6400000, '2023-09-25', 'active'],
  ['Nargiza', 'Abdullayeva', '+998901000013', 'nargiza.abdullayeva@finora.uz', 'Moliya', 'Hisobchi', 6900000, '2024-07-08', 'active'],
  ['Farrux', 'Jo‘rayev', '+998901000014', 'farrux.jurayev@finora.uz', 'IT', 'Dasturchi', 8100000, '2025-03-04', 'active'],
  ['Laylo', 'Hamidova', '+998901000015', 'laylo.hamidova@finora.uz', 'Marketing', 'Mutaxassis', 5300000, '2025-05-19', 'active'],
]

const departmentsResponse = (await json('/departments/all')).body.data
const departments = Array.isArray(departmentsResponse) ? departmentsResponse : departmentsResponse.items
const positions = (await json('/positions?limit=100')).body.data.items
let created = 0
let skipped = 0

for (const [firstName, lastName, phone, email, departmentName, positionName, salary, hireDate, status] of demo) {
  const department = departments.find((item) => item.name === departmentName)
  const position = positions.find((item) => item.name === positionName && item.departmentId === department?.id)
  if (!department || !position) {
    console.log(`O‘tkazib yuborildi: ${firstName} ${lastName} (bo‘lim/lavozim topilmadi)`)
    skipped += 1
    continue
  }

  const result = await json('/employees', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ firstName, lastName, phone, email, departmentId: department.id, positionId: position.id, salary, hireDate }),
  })

  if (!result.ok) {
    console.log(`O‘tkazib yuborildi: ${firstName} ${lastName} — ${result.body.error?.message || result.status}`)
    skipped += 1
    continue
  }

  if (status === 'blocked') {
    await json(`/employees/${result.body.data.id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'blocked' }),
    })
  }
  created += 1
}

const stats = (await json('/statistics')).body.data.totals
console.log(`Qo‘shildi: ${created}, o‘tkazib yuborildi: ${skipped}`)
console.log(`Jami xodimlar: ${stats.totalEmployees}, faol: ${stats.activeEmployees}, bloklangan: ${stats.blockedEmployees}`)
