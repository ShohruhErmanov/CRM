# Finora — Xodimlarni boshqarish tizimi

Finora —korxona xodimlari, bo‘limlari va lavozimlarini boshqarish uchun mo‘ljallangan to‘liq funksional CRM modulidir. Barcha maʼlumotlar haqiqiy maʼlumotlar bazasida saqlanadi; interfeys butunlay o‘zbek tilida, korporativ qora/oq dizaynda ishlangan.

## Imkoniyatlar

1. **Xodim qo‘shish** — shaxsiy va ish maʼlumotlari, rasm yuklash (JPG/PNG/WEBP, 2 MB gacha).
2. **Xodimlarni tahrirlash** — barcha maydonlarni o‘zgartirish, rasmni almashtirish yoki o‘chirish.
3. **Xodimlar ro‘yxati** — qidiruv, bo‘lim/lavozim/holat bo‘yicha filtr, ustun bo‘yicha tartiblash, sahifalash, batafsil ko‘rish, o‘chirish.
4. **Bo‘limlar** — qo‘shish, tahrirlash, o‘chirish, qidiruv, xodimlar va lavozimlar soni, bog‘liqlik himoyasi.
5. **Lavozimlar** — qo‘shish, tahrirlash, o‘chirish, bo‘limga biriktirish, bo‘lim bo‘yicha filtr.
6. **Faoliyat statistikasi** — asosiy ko‘rsatkichlar, bo‘limlar/lavozimlar kesimida grafiklar, faol/bloklangan nisbati, 12 oylik yollash tendensiyasi, so‘nggi harakatlar.
7. **Faollashtirish/bloklash** — tasdiqlash oynasi bilan holatni o‘zgartirish (maʼlumotlar o‘chirilmaydi).

Qo‘shimcha: boshqaruv paneli, sozlamalar sahifasi (tizim holatini tekshirish, statistikani yangilash, maʼlumotlarni JSON ga yuklab olish), bildirishnomalar, yuklash/xatolik/bo‘sh holatlar, mobil menyu va yon menyuni toraytirish.

## Texnologiya

| Qatlam | Texnologiya |
| --- | --- |
| Frontend | React 19, React Router 7, Vite 8 |
| Backend | Node.js 24, Express 5, multer, helmet, cors, dotenv |
| Maʼlumotlar bazasi | SQLite (`node:sqlite`, `DatabaseSync`) |
| Testlar | Node built-in `node:test` |
| Sifat | ESLint 10, Vite production build |

Maʼlumotlar bazasiga ishlash faqat `backend/src/models/` qatlamida bo‘lganligi uchun keyinchalik PostgreSQL ga o‘tish oson.

## Talablar

- **Node.js 22.5+** (`node:sqlite` moduli talab qilinadi; ishlab chiqarish 24.x da sinovdan o‘tgan)
- npm 10+

## O‘rnatish va ishga tushirish

```bash
# 1. Barcha bog‘liqliklarni o‘rnatish
npm install
cd backend && npm install && cd ..

# 2. Muhit faylini yaratish (ixtiyoriy, standart qiymatlar ishlaydi)
copy backend\.env.example backend\.env

# 3. Frontend + backend ni bir vaqtda ishga tushirish
npm run dev:all
```

- Frontend: <http://localhost:5173>
- Backend API: <http://localhost:4000/api>
- Rasm fayllari: <http://localhost:4000/uploads>

Agar alohida ishga tushirmoqchi bo‘lsangiz:

```bash
npm run dev:backend   # faqat server
npm run dev           # faqat Vite (frontend)
npm run seed:demo     # demo xodimlarni API orqali bazaga qo‘shish (15 ta, qayta ishga tushirish xavfsiz)
```

Ishlab chiqarish uchun:

```bash
npm run build         # dist/ papkasiga tayyor frontend
npm start             # backend + tayyor frontendni bir manzilda beradi
```

Vite dev/preview serveri `/api` va `/uploads` so‘rovlarini avtomatik tarzda `localhost:4000` ga proksi qiladi, shuning uchun CORS muammosi yuzaga kelmaydi.

## Muhit o‘zgaruvchilari

`backend/.env` faylida (`backend/.env.example` asosida):

| O‘zgaruvchi | Standart | Tavsif |
| --- | --- | --- |
| `PORT` | `4000` | API server porti |
| `DB_PATH` | `backend/database/finora.db` | SQLite fayli |
| `CLIENT_ORIGIN` | `http://localhost:5173` | Ruxsat etilgan frontend manzili (vergul bilan ajratiladi) |
| `UPLOAD_DIR` | `backend/uploads` | Rasm fayllari saqlanadigan papka |
| `MAX_PHOTO_SIZE` | `2097152` | Rasmning eng katta hajmi (2 MB) |
| `SEED_REFERENCE_DATA` | `true` | Birinchi ishga tushirishda namunaviy bo‘lim va lavozimlarni kiritish |

`SEED_REFERENCE_DATA=false` qilib qo‘yilsa, baza butunlay bo‘sh yaratiladi (xodimlar yoki statistikalar uchun sunʼiy maʼlumot ishlatilmaydi).

## API

Barcha javoblar `JSON` formatida:

```json
{ "success": true, "data": { "...": "..." }, "message": "..." }
```

Xatolik:

```json
{ "success": false, "error": { "code": "...", "message": "O‘zbekcha xabar", "details": {} } }
```

| Usul | Manzil | Tavsif |
| --- | --- | --- |
| `GET` | `/api/health` | Tizim holati |
| `GET` | `/api/employees` | Ro‘yxat: `q`, `department_id`, `position_id`, `status`, `sort_by`, `sort_order`, `page`, `limit` |
| `GET` | `/api/employees/:id` | Bitta xodim |
| `POST` | `/api/employees` | Yaratish (`JSON` yoki `multipart/form-data` + `photo`) |
| `PUT` | `/api/employees/:id` | Yangilash (`removePhoto=true` bilan rasm o‘chiriladi) |
| `PATCH` | `/api/employees/:id/status` | Holat: `active` / `blocked` |
| `DELETE` | `/api/employees/:id` | O‘chirish |
| `GET` | `/api/departments`, `/api/departments/all` | Ro‘yxat / barchasi |
| `GET`, `POST` | `/api/departments`, `/api/departments/:id` | O‘qish / yaratish |
| `PUT`, `DELETE` | `/api/departments/:id` | Yangilash / o‘chirish |
| `GET`, `POST` | `/api/positions`, `/api/positions/:id` | Ro‘yxat (`q`, `department_id`) / yaratish |
| `PUT`, `DELETE` | `/api/positions/:id` | Yangilash / o‘chirish |
| `GET` | `/api/statistics` | Barcha statistika ko‘rsatkichlari |

Tartiblash uchun ruxsat etilgan ustunlar: `id`, `name`, `phone`, `email`, `department`, `position`, `salary`, `hireDate`, `status`, `createdAt`.

## Maʼlumotlar bazasi

`employees`, `departments`, `positions` jadvallari birlamchi kalit, tashqi kalit (`FK`), noyoblik (`UNIQUE`) cheklovlari va indekslarga ega. Qo‘shimcha `activity_log` va `app_meta` jadvallari mos ravishda harakatlar tarixini va bazani ishga tushirish holatini saqlaydi. Baza fayli qayta ishga tushirishlar orasida saqlanadi.

## Test va sifat nazorati

```bash
npm test      # 12 ta integratsion test (haqiqiy HTTP so‘rovlari bilan)
npm run lint  # ESLint tekshiruvi
npm run build # Production build
```

Integratsion testlar vaqtinchalik bazada ishlaydi va quyidagilarni qamrab oladi: sog‘liq tekshiruvi, bo‘lim/lavozim yaratish va takroriy nom nazorati, xodim yaratish/tahrirlash/o‘chirish, validatsiya, noyob elektron pochta va telefon, qidiruv/filtr/tartiblash/sahifalash, holat o‘zgartirish, rasm yuklash va statik fayl, fayl turi/hajmi xavfsizligi, bog‘liqlik himoyasi, statistika hisoblari, CORS va maʼlumotlarning saqlanishi.

## Tekshiruv ro‘yxati (20 band)

| # | Tekshiruv | Holat |
| --- | --- | --- |
| 1 | Xodim qo‘shish (UI + API) | ✅ |
| 2 | Xodim tahrirlash (UI + API) | ✅ |
| 3 | Xodimlar ro‘yxati va sahifalash | ✅ |
| 4 | Qidiruv (ism/telefon) | ✅ |
| 5 | Bo‘lim/lavozim/holat filtrlari | ✅ |
| 6 | Ustun bo‘yicha tartiblash | ✅ |
| 7 | Batafsil ko‘rish oynasi | ✅ |
| 8 | Rasm yuklash va ko‘rsatish | ✅ |
| 9 | Rasmni o‘chirish | ✅ |
| 10 | Xodimni bloklash/faollashtirish | ✅ |
| 11 | Xodimni o‘chirish va tasdiqlash | ✅ |
| 12 | Bo‘lim qo‘shish/tahrirlash/o‘chirish | ✅ |
| 13 | Lavozim qo‘shish/tahrirlash/o‘chirish | ✅ |
| 14 | Bo‘lim/lavozim bog‘liqlik himoyasi | ✅ |
| 15 | Statistika haqiqiy maʼlumotlardan | ✅ |
| 16 | Grafiklar (bar/donut/line) | ✅ |
| 17 | Sozlamalar vositalari va eksport | ✅ |
| 18 | Maʼlumotlar qayta ishga tushirishda saqlanadi | ✅ |
| 19 | `npm test` / `npm run lint` / `npm run build` | ✅ |
| 20 | Mobil menyu va adaptiv dizayn | ✅ |

## Loyha tuzilmasi

```text
backend/
  database/        # sxema va SQLite fayli
  src/
    config/        # muhit va maʼlumotlar bazasi ulanishi
    controllers/   # HTTP boshqaruvchilar
    middleware/    # rasm yuklash, xatoliklar
    models/        # SQL so‘rovlari (PostgreSQL ga o‘tish nuqtasi)
    routes/        # API yo‘llari
    services/      # biznes qoidalar
    validators/    # maʼlumot tekshiruvi
  tests/           # integratsion testlar
src/
  components/      # umumiy UI, shakllar, jadvallar, layout
  contexts/        # bildirishnomalar
  hooks/           # useDebounce, useToast
  pages/           # Dashboard, Employees, Departments, Positions, Statistics, Settings
  routes/          # marshrutlar
  services/        # REST klient
  styles/          # global dizayn tizimi
  utils/           # formatlash va validatsiya
```

## Eslatma

Dizayn palitrasi: `#000000`, `#111111`, `#FFFFFF`, `#808080`, `#333333`. Barcha ko‘rinadigan matnlar o‘zbek lotin yozuvida. Sunʼiy (fake) maʼlumotlar ishlatilmaydi — barcha ko‘rsatkichlar bevosita maʼlumotlar bazasidan hisoblanadi.
