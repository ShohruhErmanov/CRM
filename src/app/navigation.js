import {
  BarChart3,
  Briefcase,
  CheckSquare,
  LayoutDashboard,
  Settings,
  Users,
} from 'lucide-react';

/**
 * Central CRM navigation registry for Finora.
 * Teammates implementing other CRM modules should register their module path
 * and flip `ready: true` once their feature route is wired in `src/app/router.jsx`.
 */
export const CRM_NAV_ITEMS = [
  {
    id: 'dashboard',
    label: 'Boshqaruv paneli',
    path: '/dashboard',
    icon: LayoutDashboard,
    ready: false,
    featurePath: 'src/features/dashboard',
    ownerHint: 'Jamoadosh moduli',
    description: 'Umumiy KPI, kunlik operator faolligi va tushum dinamikasi.',
  },
  {
    id: 'customers',
    label: 'Mijozlar bazasi',
    path: '/customers',
    icon: Users,
    ready: true,
    featurePath: 'src/features/customers',
    ownerHint: 'Tayyor modul',
    description: 'Mijozlarni boshqarish, statuslar, tafsilotlar va aloqa tarixi.',
  },
  {
    id: 'deals',
    label: 'Bitimlar (Pipeline)',
    path: '/deals',
    icon: Briefcase,
    ready: false,
    featurePath: 'src/features/deals',
    ownerHint: 'Jamoadosh moduli',
    description: 'Savdo bosqichlari, kanban taxtasi va shartnoma summalari.',
  },
  {
    id: 'tasks',
    label: 'Vazifalar',
    path: '/tasks',
    icon: CheckSquare,
    ready: false,
    featurePath: 'src/features/tasks',
    ownerHint: 'Jamoadosh moduli',
    description: 'Operator qo‘ng‘iroqlari, uchrashuvlar va eslatmalar rejasi.',
  },
  {
    id: 'reports',
    label: 'Hisobotlar',
    path: '/reports',
    icon: BarChart3,
    ready: false,
    featurePath: 'src/features/reports',
    ownerHint: 'Jamoadosh moduli',
    description: 'Konversiya ko‘rsatkichlari va oylik tahlillar.',
  },
  {
    id: 'settings',
    label: 'Sozlamalar',
    path: '/settings',
    icon: Settings,
    ready: false,
    featurePath: 'src/features/settings',
    ownerHint: 'Jamoadosh moduli',
    description: 'Jamoa rollari, operator ruxsatlari va integratsiyalar.',
  },
];
