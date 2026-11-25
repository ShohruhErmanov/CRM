export const employees = [
  { id: 'se', name: 'Shohruh Ermanov', initials: 'SE', role: 'Administrator' },
  { id: 'ak', name: 'Aziza Karimova', initials: 'AK', role: 'Dizayner' },
  { id: 'jm', name: 'Jasur Murodov', initials: 'JM', role: 'Frontend dasturchi' },
  { id: 'dn', name: 'Dilnoza Nabiyeva', initials: 'DN', role: 'Backend dasturchi' },
]

export const initialTasks = [
  { id: 1, title: 'Finora dizaynini tayyorlash', project: 'Finora', status: 'Pending', priority: 'High', due: '26 Nov', assigneeId: 'ak', comments: [{ id: 1, author: 'Shohruh Ermanov', text: 'Dizayn tizimini yakunlaymiz.', time: '09:30' }] },
  { id: 2, title: 'API integratsiya qilish', project: 'Backend', status: 'In Progress', priority: 'Medium', due: '28 Nov', assigneeId: 'dn', comments: [{ id: 2, author: 'Dilnoza Nabiyeva', text: 'Endpointlar tayyorlanmoqda.', time: '10:15' }, { id: 3, author: 'Shohruh Ermanov', text: 'Test maʼlumotlarini tekshiring.', time: '11:02' }] },
  { id: 3, title: 'Jamoaga vazifalarni biriktirish', project: 'Operations', status: 'Pending', priority: 'High', due: '27 Nov', assigneeId: 'se', comments: [] },
  { id: 4, title: 'Kanban boardni toʻldirish', project: 'Frontend', status: 'In Progress', priority: 'Low', due: '30 Nov', assigneeId: 'jm', comments: [{ id: 4, author: 'Jasur Murodov', text: 'Kartalar va ustunlar tayyor.', time: '14:20' }] },
  { id: 5, title: 'Deadline sozlamalarini qoʻshish', project: 'Finora', status: 'Completed', priority: 'Medium', due: '24 Nov', assigneeId: 'ak', comments: [] },
  { id: 6, title: 'Task commentlarini test qilish', project: 'QA', status: 'Completed', priority: 'Low', due: '23 Nov', assigneeId: 'jm', comments: [] },
]

export const taskColumns = ['Pending', 'In Progress', 'Completed']
