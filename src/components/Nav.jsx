import React from 'react'

export default function Nav({ page, setPage }) {
  const links = [
    { id: 'home',       label: 'Home'       },
    { id: 'plans',      label: 'Plans'      },
    { id: 'library',    label: 'Library'    },
    { id: 'calculator', label: 'Calculator' },
    { id: 'diet',       label: 'Diet'       },
    { id: 'progress',   label: '📈 Progress' },
    { id: 'records',    label: '🏅 Records'  }
  ]

  return (
    <header className="nav">
      <div className="brand">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="24" height="24" rx="6" fill="#ff6a00" />
          <path d="M6 14l2-4 4 6 6-10" stroke="#0b0b0b" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        FitForge
      </div>
      <nav className="nav-links">
        {links.map(l => (
          <button key={l.id} className={page === l.id ? 'active' : ''} onClick={() => setPage(l.id)}>
            {l.label}
          </button>
        ))}
      </nav>
    </header>
  )
}
