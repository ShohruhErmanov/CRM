import { useMemo, useState } from 'react'
import './App.css'

const Icon = ({ name, size = 20 }) => {
  const paths = {
    grid: '<rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
    chart: '<path d="M3 3v18h18"/><path d="m7 16 4-5 4 3 5-7"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
    history: '<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5M12 7v5l3 2"/>',
    settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-1.42 1.42-.06-.06A1.7 1.7 0 0 0 16.4 18a1.7 1.7 0 0 0-1 .6l-.08.1V21h-2v-2.3l-.08-.1A1.7 1.7 0 0 0 12 18a1.7 1.7 0 0 0-1.88.34l-.06.06-1.42-1.42.06-.06A1.7 1.7 0 0 0 9 14.6a1.7 1.7 0 0 0-.6-1l-.1-.08H6v-2h2.3l.1-.08A1.7 1.7 0 0 0 9 10a1.7 1.7 0 0 0-.34-1.88l-.06-.06L10.02 6.6l.06.06A1.7 1.7 0 0 0 12 7a1.7 1.7 0 0 0 1-.6l.08-.1V4h2v2.3l.08.1A1.7 1.7 0 0 0 16 7a1.7 1.7 0 0 0 1.88-.34l.06-.06 1.42 1.42-.06.06A1.7 1.7 0 0 0 19 10a1.7 1.7 0 0 0 .6 1l.1.08H22v2h-2.3l-.1.08A1.7 1.7 0 0 0 19 15Z"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
    bell: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
    arrow: '<path d="m9 18 6-6-6-6"/>',
  }
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" dangerouslySetInnerHTML={{ __html: paths[name] }} />
}

const initialLeads = [
  { id: 1, name: 'Aziz Karimov', company: 'NovaTech', phone: '+998 90 123 45 67', status: 'Yangi', value: 8500, date: '25 noy, 10:30' },
  { id: 2, name: 'Madina Aliyeva', company: 'Orion Studio', phone: '+998 99 456 78 90', status: 'Bogʻlangan', value: 5200, date: '24 noy, 16:15' },
  { id: 3, name: 'Bekzod Rahimov', company: 'Asaka Auto', phone: '+998 91 765 43 21', status: 'Qiziqdi', value: 12000, date: '24 noy, 11:40' },
  { id: 4, name: 'Dilnoza Saidova', company: 'Green Market', phone: '+998 93 234 56 78', status: 'Aylantirildi', value: 6800, date: '23 noy, 14:20' },
]

const statusClass = { Yangi: 'new', 'Bogʻlangan': 'contacted', Qiziqdi: 'interested', Aylantirildi: 'converted', Yoʻqotildi: 'lost' }

function App() {
  const [active, setActive] = useState('Bosh sahifa')
  const [leads, setLeads] = useState(initialLeads)
  const [filter, setFilter] = useState('Barchasi')
  const [search, setSearch] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedLead, setSelectedLead] = useState(null)

  const filteredLeads = useMemo(() => leads.filter((lead) => {
    const matchesFilter = filter === 'Barchasi' || lead.status === filter
    const text = `${lead.name} ${lead.company} ${lead.phone}`.toLowerCase()
    return matchesFilter && text.includes(search.toLowerCase())
  }), [leads, filter, search])

  const nav = [
    ['Bosh sahifa', 'grid'], ['Leadlar', 'users'], ['Sales Pipeline', 'target'],
    ['Mijozlar', 'chart'], ['Sales History', 'history'], ['Sozlamalar', 'settings'],
  ]

  function addLead(event) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    setLeads((current) => [{
      id: Date.now(), name: data.get('name'), company: data.get('company'),
      phone: data.get('phone'), status: data.get('status'), value: Number(data.get('value')),
      date: 'Hozir',
    }, ...current])
    setModalOpen(false)
  }

  function updateLeadStatus(id, status) {
    setLeads((current) => current.map((lead) => lead.id === id ? { ...lead, status } : lead))
  }

  const leadTable = (compact = false) => (
    <div className="table-wrap"><table><thead><tr><th>Mijoz</th><th>Telefon</th><th>Status</th><th>Summa</th><th></th></tr></thead><tbody>
      {filteredLeads.map((lead) => <tr key={lead.id}>
        <td><button className="customer customer-button" onClick={() => setSelectedLead(lead)}><div className="customer-avatar">{lead.name.split(' ').map(n => n[0]).join('').slice(0, 2)}</div><div><strong>{lead.name}</strong><small>{lead.company}</small></div></button></td>
        <td>{lead.phone}</td>
        <td><span className={`status ${statusClass[lead.status]}`}><i />{lead.status}</span></td>
        <td><strong>${lead.value.toLocaleString()}</strong></td>
        <td><select className="row-status" aria-label="Lead statusini o'zgartirish" value={lead.status} onChange={(e) => updateLeadStatus(lead.id, e.target.value)}><option>Yangi</option><option>Bogʻlangan</option><option>Qiziqdi</option><option>Aylantirildi</option><option>Yoʻqotildi</option></select></td>
      </tr>)}
    </tbody></table>{compact && filteredLeads.length === 0 && <div className="empty-state">Lead topilmadi</div>}</div>
  )

  const pipelineStatuses = ['Yangi', 'Bogʻlangan', 'Qiziqdi', 'Aylantirildi', 'Yoʻqotildi']

  return (
    <div className="app-shell">
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="brand"><div className="brand-mark"><span></span><span></span><span></span></div><strong>CRM<span>Pro</span></strong></div>
        <nav>{nav.map(([label, icon]) => (
          <button key={label} className={active === label ? 'nav-item active' : 'nav-item'} onClick={() => { setActive(label); setSidebarOpen(false) }}><Icon name={icon} /><span>{label}</span></button>
        ))}</nav>
        <div className="sidebar-footer"><div className="mini-avatar">SA</div><div><strong>Sardor Aliyev</strong><small>Administrator</small></div></div>
      </aside>

      <main className="main">
        <header className="topbar">
          <button className="icon-button menu-button" onClick={() => setSidebarOpen(!sidebarOpen)}><Icon name="menu" /></button>
          <div className="search-box"><Icon name="search" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Ism, kompaniya yoki telefon bo‘yicha qidirish..." /></div>
          <button className="icon-button notification"><Icon name="bell" /><i /></button>
          <div className="profile"><div className="avatar">SA</div><div className="profile-text"><strong>Sardor Aliyev</strong><small>Administrator</small></div></div>
        </header>

        <section className="content">
          <div className="page-heading"><div><p className="eyebrow">CRM DASHBOARD</p><h1>{active}</h1></div><button className="primary-button" onClick={() => setModalOpen(true)}><Icon name="plus" />Yangi Lead</button></div>

          {active === 'Bosh sahifa' && <>
            <div className="stats-grid">
              <article className="stat-card"><div className="stat-icon blue"><Icon name="users" /></div><div><p>Jami leadlar</p><h2>{leads.length + 124}</h2><span className="positive">↗ 12.5%</span></div></article>
              <article className="stat-card"><div className="stat-icon purple"><Icon name="target" /></div><div><p>Konversiya</p><h2>28.4%</h2><span className="positive">↗ 4.2%</span></div></article>
              <article className="stat-card"><div className="stat-icon green"><Icon name="chart" /></div><div><p>Oylik savdo</p><h2>$48,250</h2><span className="positive">↗ 8.1%</span></div></article>
              <article className="stat-card"><div className="stat-icon orange"><Icon name="history" /></div><div><p>Oʻrtacha chek</p><h2>$6,820</h2><span className="positive">↗ 2.7%</span></div></article>
            </div>
            <div className="dashboard-grid">
              <section className="panel leads-panel"><div className="panel-header"><div><h3>Oxirgi Leadlar</h3><p>Soʻnggi qoʻshilgan mijozlar</p></div><button className="text-button" onClick={() => setActive('Leadlar')}>Barchasini ko‘rish <Icon name="arrow" size={16} /></button></div>
                <div className="filters">{['Barchasi', 'Yangi', 'Bogʻlangan', 'Qiziqdi', 'Aylantirildi'].map((item) => <button key={item} onClick={() => setFilter(item)} className={filter === item ? 'selected' : ''}>{item}</button>)}</div>
                {leadTable(true)}
              </section>
              <section className="panel pipeline-panel"><div className="panel-header"><div><h3>Sales Pipeline</h3><p>Leadlar holati</p></div><button className="dots">•••</button></div><div className="pipeline">
                {[["Yangi", 34, '#3B82F6'], ['Bogʻlangan', 28, '#8B5CF6'], ['Qiziqdi', 21, '#F59E0B'], ['Aylantirildi', 17, '#10B981']].map(([label, value, color]) => <div className="pipeline-row" key={label}><div className="pipeline-label"><span>{label}</span><strong>{value}%</strong></div><div className="bar"><i style={{ width: `${value * 2.2}%`, background: color }} /></div></div>)}
              </div><div className="pipeline-total"><span>Jami pipeline qiymati</span><strong>$124,500</strong></div></section>
            </div>
          </>}

          {active === 'Leadlar' && <section className="panel page-panel"><div className="panel-header"><div><h3>Barcha Leadlar</h3><p>{filteredLeads.length} ta natija</p></div></div><div className="filters">{['Barchasi', 'Yangi', 'Bogʻlangan', 'Qiziqdi', 'Aylantirildi', 'Yoʻqotildi'].map((item) => <button key={item} onClick={() => setFilter(item)} className={filter === item ? 'selected' : ''}>{item}</button>)}</div>{leadTable(false)}</section>}

          {active === 'Sales Pipeline' && <div className="kanban">{pipelineStatuses.map((status) => <section className="kanban-column" key={status}><div className="kanban-header"><span className={`status-dot ${statusClass[status]}`}></span><strong>{status}</strong><b>{leads.filter((l) => l.status === status).length}</b></div>{leads.filter((l) => l.status === status).map((lead) => <button className="lead-card" key={lead.id} onClick={() => setSelectedLead(lead)}><strong>{lead.name}</strong><small>{lead.company}</small><div><span>{lead.phone}</span><b>${lead.value.toLocaleString()}</b></div></button>)}</section>)}</div>}

          {active === 'Mijozlar' && <section className="panel page-panel"><div className="panel-header"><div><h3>Mijozlar</h3><p>Aylantirilgan va faol mijozlar</p></div></div>{leadTable(false)}</section>}

          {active === 'Sales History' && <section className="panel page-panel"><div className="panel-header"><div><h3>Sotuvlar tarixi</h3><p>Oxirgi operatsiyalar</p></div></div><div className="table-wrap"><table><thead><tr><th>Mijoz</th><th>Kampaniya</th><th>Vaqt</th><th>Summa</th><th>Holat</th></tr></thead><tbody>{leads.map((lead) => <tr key={lead.id}><td><strong>{lead.name}</strong></td><td>{lead.company}</td><td>{lead.date}</td><td><strong>${lead.value.toLocaleString()}</strong></td><td><span className={`status ${statusClass[lead.status]}`}><i />{lead.status}</span></td></tr>)}</tbody></table></div></section>}

          {active === 'Sozlamalar' && <section className="panel settings-panel"><div className="panel-header"><div><h3>Hisob sozlamalari</h3><p>Shaxsiy maʼlumotlar va xabarnomalar</p></div></div><div className="settings-content"><label>Toʻliq ism<input defaultValue="Sardor Aliyev" /></label><label>Email<input defaultValue="sardor@crmpro.uz" /></label><label>Til<select defaultValue="Oʻzbekcha"><option>Oʻzbekcha</option><option>Русский</option><option>English</option></select></label><button className="primary-button">Oʻzgarishni saqlash</button></div></section>}
        </section>
      </main>

      {modalOpen && <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && setModalOpen(false)}><form className="modal" onSubmit={addLead}><div className="modal-header"><div><p className="eyebrow">Yangi mijoz</p><h3>Lead qoʻshish</h3></div><button type="button" onClick={() => setModalOpen(false)}>×</button></div><div className="form-grid"><label>Ism familiya<input name="name" required placeholder="Masalan: Ali Valiyev" /></label><label>Kompaniya<input name="company" required placeholder="Masalan: Tech Solutions" /></label><label>Telefon<input name="phone" required placeholder="+998 90 000 00 00" /></label><label>Summa<input name="value" type="number" required placeholder="5000" /></label><label className="full">Status<select name="status"><option>Yangi</option><option>Bogʻlangan</option><option>Qiziqdi</option><option>Aylantirildi</option></select></label></div><button className="primary-button submit" type="submit"><Icon name="plus" />Lead qoʻshish</button></form></div>}

      {selectedLead && <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && setSelectedLead(null)}><div className="modal lead-detail"><div className="modal-header"><div><p className="eyebrow">Lead maʼlumotlari</p><h3>{selectedLead.name}</h3></div><button type="button" onClick={() => setSelectedLead(null)}>×</button></div><div className="detail-grid"><div><small>Kompaniya</small><strong>{selectedLead.company}</strong></div><div><small>Telefon</small><strong>{selectedLead.phone}</strong></div><div><small>Summa</small><strong>${selectedLead.value.toLocaleString()}</strong></div><div><small>Yaratilgan</small><strong>{selectedLead.date}</strong></div></div><label className="detail-status">Status<select value={selectedLead.status} onChange={(e) => { updateLeadStatus(selectedLead.id, e.target.value); setSelectedLead({ ...selectedLead, status: e.target.value }) }}><option>Yangi</option><option>Bogʻlangan</option><option>Qiziqdi</option><option>Aylantirildi</option><option>Yoʻqotildi</option></select></label></div></div>}
    </div>
  )
}

export default App
