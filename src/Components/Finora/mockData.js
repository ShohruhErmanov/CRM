// Clearly separated mock data for Finora Dashboard

export const initialStatsData = {
  customers: {
    title: 'Total Customers',
    value: 4826,
    displayValue: '4,826',
    change: 12.5,
    isPositive: true,
    comparisonText: 'vs. 4,289 last month',
    period: 'previous month',
    detail: '+537 new clients'
  },
  employees: {
    title: 'Total Employees',
    value: 184,
    displayValue: '184',
    change: 4.8,
    isPositive: true,
    comparisonText: 'vs. 176 last month',
    period: 'previous month',
    detail: '+8 new hires'
  },
  leads: {
    title: 'Total Leads',
    value: 1420,
    displayValue: '1,420',
    change: -2.4,
    isPositive: false,
    comparisonText: 'vs. 1,455 last month',
    period: 'previous month',
    detail: '348 qualified'
  },
  revenue: {
    title: 'Total Revenue',
    value: 684250,
    displayValue: '$684,250',
    change: 18.2,
    isPositive: true,
    comparisonText: 'vs. $578,900 last month',
    period: 'previous month',
    detail: 'Target: $650,000'
  }
};

export const salesChartData = {
  monthly: [
    { label: 'Jan', revenue: 42000, target: 40000, growth: 5.0 },
    { label: 'Feb', revenue: 48500, target: 42000, growth: 15.4 },
    { label: 'Mar', revenue: 53200, target: 45000, growth: 9.6 },
    { label: 'Apr', revenue: 49800, target: 46000, growth: -6.3 },
    { label: 'May', revenue: 61400, target: 50000, growth: 23.2 },
    { label: 'Jun', revenue: 58900, target: 52000, growth: -4.0 },
    { label: 'Jul', revenue: 67300, target: 55000, growth: 14.2 },
    { label: 'Aug', revenue: 71200, target: 58000, growth: 5.7 },
    { label: 'Sep', revenue: 64800, target: 60000, growth: -8.9 },
    { label: 'Oct', revenue: 78500, target: 62000, growth: 21.1 },
    { label: 'Nov', revenue: 84600, target: 65000, growth: 7.7 },
    { label: 'Dec', revenue: 94050, target: 70000, growth: 11.1 }
  ],
  yearly: [
    { label: '2021', revenue: 380000, target: 350000, growth: 12.0 },
    { label: '2022', revenue: 490000, target: 450000, growth: 28.9 },
    { label: '2023', revenue: 595000, target: 550000, growth: 21.4 },
    { label: '2024', revenue: 720000, target: 680000, growth: 21.0 },
    { label: '2025', revenue: 840000, target: 800000, growth: 16.6 },
    { label: '2026', revenue: 980000, target: 920000, growth: 16.7 }
  ]
};

export const monthlyStats = {
  currentMonth: 'November 2026',
  metrics: [
    {
      title: 'Monthly Revenue',
      value: '$84,600',
      numeric: 84600,
      target: '$75,000',
      progress: 112,
      growth: '+14.6%',
      isPositive: true,
      description: 'Exceeded target by $9,600'
    },
    {
      title: 'New Customers',
      value: '348',
      numeric: 348,
      target: '300',
      progress: 116,
      growth: '+18.2%',
      isPositive: true,
      description: 'Strongest inflow from Enterprise'
    },
    {
      title: 'Completed Sales',
      value: '215',
      numeric: 215,
      target: '200',
      progress: 107,
      growth: '+8.4%',
      isPositive: true,
      description: 'Average ticket: $3,180'
    },
    {
      title: 'Total Leads',
      value: '1,420',
      numeric: 1420,
      target: '1,500',
      progress: 94,
      growth: '-2.4%',
      isPositive: false,
      description: 'Conversion rate: 15.1%'
    }
  ]
};

export const recentActivitiesData = [
  {
    id: 'act-1',
    user: 'Alina Karimova',
    role: 'Lead Architect',
    avatar: 'AK',
    action: 'Deployed Cloud Infrastructure v2.4 to Production cluster',
    type: 'employee',
    status: 'Completed',
    time: '12 minutes ago',
    date: '2026-11-25 16:17',
    category: 'Engineering'
  },
  {
    id: 'act-2',
    user: 'Nordic FinTech Corp',
    role: 'Enterprise Client',
    avatar: 'NF',
    action: 'Upgraded subscription to Enterprise Platinum SLA',
    type: 'sales',
    status: 'Completed',
    time: '45 minutes ago',
    date: '2026-11-25 15:44',
    category: 'Sales'
  },
  {
    id: 'act-3',
    user: 'Sherzod Rashidov',
    role: 'Account Executive',
    avatar: 'SR',
    action: 'Closed annual contract with Apex Logistics ($48,000)',
    type: 'sales',
    status: 'Verified',
    time: '2 hours ago',
    date: '2026-11-25 14:29',
    category: 'Sales'
  },
  {
    id: 'act-4',
    user: 'Elena Vostrikova',
    role: 'Customer',
    avatar: 'EV',
    action: 'Registered new organization account & team members',
    type: 'registration',
    status: 'Completed',
    time: '3 hours ago',
    date: '2026-11-25 13:10',
    category: 'Onboarding'
  },
  {
    id: 'act-5',
    user: 'Rustam Akhmedov',
    role: 'Security Engineer',
    avatar: 'RA',
    action: 'Completed quarterly SOC2 compliance audit & access reviews',
    type: 'employee',
    status: 'Completed',
    time: '5 hours ago',
    date: '2026-11-25 11:20',
    category: 'Security'
  },
  {
    id: 'act-6',
    user: 'Synergy Dynamics',
    role: 'Inbound Lead',
    avatar: 'SD',
    action: 'Requested customized CRM & ERP integration demo',
    type: 'registration',
    status: 'In Progress',
    time: '7 hours ago',
    date: '2026-11-25 09:35',
    category: 'Leads'
  },
  {
    id: 'act-7',
    user: 'Farrukh Mirzayev',
    role: 'Billing Specialist',
    avatar: 'FM',
    action: 'Reconciled pending invoices for EMEA Enterprise clients',
    type: 'user',
    status: 'Pending',
    time: '1 day ago',
    date: '2026-11-24 17:02',
    category: 'Finance'
  }
];

export const analyticsReportsData = {
  revenueBreakdown: [
    { channel: 'Enterprise Cloud Solutions', revenue: 342000, percentage: 50.0, growth: '+22%' },
    { channel: 'Software Licenses & Subscriptions', revenue: 198500, percentage: 29.0, growth: '+15%' },
    { channel: 'Consulting & Implementation', revenue: 95750, percentage: 14.0, growth: '+8%' },
    { channel: 'Technical Support & SLA', revenue: 48000, percentage: 7.0, growth: '+11%' }
  ],
  employeePerformance: [
    { name: 'Sherzod Rashidov', role: 'Sr. Account Executive', deals: 24, targetAchieved: 128, rating: 4.9, status: 'Top Performer' },
    { name: 'Alina Karimova', role: 'Solutions Architect', deals: 19, targetAchieved: 114, rating: 4.8, status: 'Exceeding' },
    { name: 'Dilnoza Salimova', role: 'Product Specialist', deals: 16, targetAchieved: 102, rating: 4.7, status: 'On Target' },
    { name: 'Otabek Yusupov', role: 'Business Development', deals: 28, targetAchieved: 95, rating: 4.6, status: 'On Target' },
    { name: 'Javohir Kadyrov', role: 'Customer Success', deals: 14, targetAchieved: 90, rating: 4.5, status: 'Developing' }
  ],
  customerStats: {
    retentionRate: '96.4%',
    netPromoterScore: '74',
    averageLTV: '$34,500',
    churnRate: '1.2%',
    regions: [
      { name: 'Central Asia & CIS', clients: 1840, percentage: 38 },
      { name: 'Europe & UK', clients: 1450, percentage: 30 },
      { name: 'North America', clients: 980, percentage: 20 },
      { name: 'Asia Pacific', clients: 556, percentage: 12 }
    ]
  }
};

export const customersList = [
  { id: 'CUST-101', name: 'Global Tech Innovations', contact: 'Akbar Saidov', email: 'akbar@globaltech.uz', tier: 'Enterprise', status: 'Active', spent: '$94,200', joined: '2024-03-15' },
  { id: 'CUST-102', name: 'Horizon Cloud Systems', contact: 'Malika Nazarova', email: 'malika@horizon.io', tier: 'Business', status: 'Active', spent: '$42,500', joined: '2024-08-20' },
  { id: 'CUST-103', name: 'Apex Logistics & Freight', contact: 'Davron Aliyev', email: 'davron@apexlog.com', tier: 'Enterprise', status: 'Active', spent: '$68,100', joined: '2025-01-10' },
  { id: 'CUST-104', name: 'FinFlow Payment Gate', contact: 'Gulnora Karimova', email: 'g.karimova@finflow.net', tier: 'Enterprise', status: 'Active', spent: '$112,000', joined: '2023-11-05' },
  { id: 'CUST-105', name: 'Nova Health Informatics', contact: 'Bobur Tursunov', email: 'bobur@novahealth.uz', tier: 'Startup', status: 'Pending', spent: '$14,800', joined: '2026-02-14' },
  { id: 'CUST-106', name: 'CyberShield Systems', contact: 'Sanjar Usmanov', email: 'sanjar@cybershield.org', tier: 'Business', status: 'Active', spent: '$37,400', joined: '2025-06-18' }
];

export const employeesList = [
  { id: 'EMP-01', name: 'Alina Karimova', role: 'Lead Solutions Architect', department: 'Engineering', email: 'alina.k@company.com', status: 'Active', projects: 8, location: 'Tashkent HQ' },
  { id: 'EMP-02', name: 'Sherzod Rashidov', role: 'Sr. Account Executive', department: 'Sales', email: 'sherzod.r@company.com', status: 'Active', projects: 14, location: 'Tashkent HQ' },
  { id: 'EMP-03', name: 'Dilnoza Salimova', role: 'Product Specialist', department: 'Product', email: 'dilnoza.s@company.com', status: 'Active', projects: 5, location: 'Remote' },
  { id: 'EMP-04', name: 'Rustam Akhmedov', role: 'Principal Security Engineer', department: 'Security', email: 'rustam.a@company.com', status: 'Active', projects: 11, location: 'Tashkent HQ' },
  { id: 'EMP-05', name: 'Otabek Yusupov', role: 'Business Development Manager', department: 'Sales', email: 'otabek.y@company.com', status: 'On Leave', projects: 7, location: 'Samarkand' }
];

export const leadsList = [
  { id: 'LEAD-501', company: 'NextGen Robotics', contact: 'Valisher Umarov', stage: 'Qualified', potential: '$55,000', probability: '85%', assignedTo: 'Sherzod Rashidov' },
  { id: 'LEAD-502', company: 'SilkRoad Commerce', contact: 'Nargiza Bakhodirova', stage: 'Contacted', potential: '$32,000', probability: '60%', assignedTo: 'Otabek Yusupov' },
  { id: 'LEAD-503', company: 'Quantum AI Labs', contact: 'Timur Mirzaev', stage: 'Proposal Sent', potential: '$84,000', probability: '75%', assignedTo: 'Sherzod Rashidov' },
  { id: 'LEAD-504', company: 'Delta AgriTech', contact: 'Khasan Pulatov', stage: 'New', potential: '$24,000', probability: '40%', assignedTo: 'Dilnoza Salimova' }
];

export const salesTransactions = [
  { id: 'INV-8821', client: 'FinFlow Payment Gate', package: 'Enterprise Annual Tier', amount: '$48,000', date: '2026-11-24', status: 'Paid', method: 'Wire Transfer' },
  { id: 'INV-8820', client: 'Global Tech Innovations', package: 'Cloud Security Add-on', amount: '$16,500', date: '2026-11-22', status: 'Paid', method: 'Credit' },
  { id: 'INV-8819', client: 'Apex Logistics & Freight', package: 'Custom ERP Connector', amount: '$23,750', date: '2026-11-19', status: 'Paid', method: 'Wire Transfer' },
  { id: 'INV-8818', client: 'Nova Health Informatics', package: 'Starter Infrastructure', amount: '$7,200', date: '2026-11-15', status: 'Processing', method: 'Credit' }
];

export const initialNotifications = [
  { id: 'notif-1', title: 'New Enterprise Deal', message: 'Apex Logistics signed annual agreement for $48,000', time: '10m ago', unread: true, type: 'success' },
  { id: 'notif-2', title: 'System Performance', message: 'Database backup completed across all availability zones', time: '1h ago', unread: true, type: 'info' },
  { id: 'notif-3', title: 'Lead Stage Updated', message: 'Quantum AI Labs moved to Proposal Sent stage', time: '3h ago', unread: false, type: 'warning' },
  { id: 'notif-4', title: 'Monthly Quota Met', message: 'November sales target achieved ahead of schedule (112%)', time: '1d ago', unread: false, type: 'success' }
];
