# Finora CRM

**IT kompaniyalar va uzoq ishlovchi operatorlar uchun** mo‘ljallangan modulli CRM tizimi.

Ushbu repozitoriyda loyiha jamoaviy ishga tayyor **feature-based** papka strukturasi asosida tashkil qilingan. Hozirda **Mijozlar bazasi (`src/features/customers`)** moduli to‘liq tayyor va qolgan CRM modullari jamoadoshlar tomonidan parallel ishlab chiqilishi uchun tayyor integratsiya nuqtalari ajratilgan.

---

## Papka strukturasi

```text
src/
├── app/
│   ├── App.jsx                 # Global providerlar (Router, Toast, CustomersProvider)
│   ├── router.jsx              # Barcha modullar marshrutlari (routes)
│   └── navigation.js           # Sidebar menyusi va modullar ro'yxati
│
├── layouts/
│   ├── CrmLayout.jsx           # Umumiy Finora Sidebar + Topbar qobig'i
│   └── ModulePlaceholder.jsx   # Jamoadoshlar modullari ulangunigacha placeholder sahifa
│
├── features/
│   └── customers/              # Tayyor modul: CRM Mijozlar bazasi
│       ├── api/                # Storage / API qatlami (REST API ga oson almashtiriladi)
│       ├── components/         # Jadval, filtrlar, status select, form/details drawer, tarix
│       ├── constants/          # Statuslar, tariflar, manbalar, event turlari
│       ├── context/            # Modullararo ulashiladigan mijozlar holati
│       ├── data/               # Boshlang'ich demo mijozlar bazasi
│       ├── hooks/              # Qidiruv, filtrlash, CRUD, status va tarix logikasi
│       ├── pages/              # CustomersPage (/customers) va CustomerDetailPage (/customers/:id)
│       └── index.js            # Modulning tashqi eksport nuqtasi (barrel export)
│
├── shared/                     # Barcha jamoadoshlar ishlatadigan umumiy qatlam
│   ├── components/ui/          # Button, Input, Select, Textarea, Badge, Avatar, Drawer, ConfirmDialog, EmptyState, Toast
│   ├── hooks/                  # useDebouncedValue, useToast
│   └── utils/                  # formatters (sana, valyuta, initsiallar), cn
│
└── styles/
    ├── tokens.css              # Finora rasmiy rang palitrasi va dizayn tokenlari
    └── global.css              # Reset, fokus ring, scrollbar va bazaviy tipografiya
```

---

## Dizayn palitrasi (`src/styles/tokens.css`)

| Rol | Rang nomi | HEX | Qayerda ishlatiladi |
|---|---|---|---|
| Asosiy fon | To‘q qora-ko‘k | `#0B0F19` | Umumiy fon (sof `#000000` ishlatilmaydi) |
| Yuzalar (Cards) | To‘q kulrang | `#161E2E` | Kartochkalar va jadvallar |
| Asosiy rang (Primary) | Yorqin ko‘k | `#3B82F6` | Tugmalar va urg‘ular |
| Asosiy matn | Oqish | `#F1F5F9` | Asosiy matnlar (sof `#FFFFFF` ko‘zni qamashtiradi) |
| Ikkilamchi matn | Xira kulrang | `#94A3B8` | Qo‘shimcha ma’lumotlar |
| Chegaralar | To‘q chegara | `#1E293B` | Kartochka va jadval chetlari |

---

## Jamoadoshlar yangi modulni qanday ulaydi?

Masalan, **Bitimlar (`deals`)** modulini qo‘shish uchun:

1. `src/features/deals/` papkasini oching (`pages/`, `components/`, `hooks/`, `api/`, `index.js`).
2. Umumiy UI komponentlarni `src/shared/components/ui` dan, ranglarni esa `var(--bg-surface)`, `var(--color-primary)` kabi CSS tokenlardan oling.
3. Mijozlar ro‘yxati kerak bo‘lsa, `import { useCustomersContext } from '../customers'` orqali ulang.
4. `src/app/navigation.js` da `deals` bandida `ready: true` qiling.
5. `src/app/router.jsx` da `<Route path="/deals" element={<DealsPage />} />` ni qo‘shing.

---

## Ishga tushirish

```bash
npm install
npm run dev
npm run lint
npm run build
```
