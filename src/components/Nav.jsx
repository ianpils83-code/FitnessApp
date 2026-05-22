import React, { useState, useEffect } from 'react'

const links = [
  { id: 'home',        label: 'Home'        },
  { id: 'plans',       label: 'Plans'       },
  { id: 'library',     label: 'Library'     },
  { id: 'calculator',  label: 'Calculator'  },
  { id: 'diet',        label: 'Diet'        },
  { id: 'macros',      label: '🍽️ Macros'   },
  { id: 'water',       label: '💧 Water'    },
  { id: 'progress',    label: '📈 Progress' },
  { id: 'records',     label: '🏅 Records'  },
  { id: 'history',     label: '🗓️ History'  },
  { id: 'measurements',label: '📏 Measure'  },
  { id: 'weekly',      label: '📆 Weekly'   },
  { id: 'profile',     label: '👤 Profile'  },
]

export default function Nav({ page, setPage, theme, toggleTheme }) {
  const [open, setOpen] = useState(false)

  // Close drawer on page change
  useEffect(() => setOpen(false), [page])

  const go = (id) => { setPage(id); setOpen(false) }

  return (
    <>
      <header className="nav">
        <div className="brand">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
            <rect width="24" height="24" rx="6" fill="#ff6a00" />
            <path d="M6 14l2-4 4 6 6-10" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          FitForge
        </div>

        {/* Desktop nav */}
        <nav className="nav-links">
          {links.map(l => (
            <button key={l.id} className={page === l.id ? 'active' : ''} onClick={() => go(l.id)}>
              {l.label}
            </button>
          ))}
          <button
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            style={{ background: 'none', border: '1.5px solid var(--b-input)', borderRadius: 8, padding: '5px 9px', cursor: 'pointer', fontSize: 15, lineHeight: 1, color: 'var(--c-text)' }}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </nav>

        {/* Mobile controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            onClick={toggleTheme}
            style={{ background: 'none', border: '1.5px solid var(--b-input)', borderRadius: 8, padding: '5px 9px', cursor: 'pointer', fontSize: 15, lineHeight: 1, color: 'var(--c-text)', display: 'none' }}
            className="mobile-theme-btn"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
          <button className="hamburger" onClick={() => setOpen(o => !o)} aria-label="Menu">
            {open ? '✕' : '☰'}
          </button>
        </div>
      </header>

      {/* Mobile drawer */}
      {open && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setOpen(false)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 98, animation: 'fadeIn 0.2s ease-out' }}
          />
          {/* Drawer */}
          <nav style={{
            position: 'fixed', top: 0, right: 0, bottom: 0, width: 240,
            background: 'var(--bg-nav)', backdropFilter: 'var(--blur)',
            WebkitBackdropFilter: 'var(--blur)',
            borderLeft: '1px solid var(--b-card)',
            zIndex: 99, padding: '20px 12px',
            display: 'flex', flexDirection: 'column', gap: 4, overflowY: 'auto',
            animation: 'slideInRight 0.25s ease-out',
          }}>
            <div style={{ fontWeight: 800, fontSize: 17, color: 'var(--brand)', marginBottom: 12, paddingLeft: 8 }}>
              FitForge
            </div>
            {links.map(l => (
              <button
                key={l.id}
                onClick={() => go(l.id)}
                style={{
                  textAlign: 'left', padding: '10px 12px', borderRadius: 8,
                  border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: page === l.id ? 700 : 500,
                  background: page === l.id ? 'linear-gradient(135deg,#ff6a00,#ff9a00)' : 'transparent',
                  color: page === l.id ? '#fff' : 'var(--c-muted)',
                  transition: 'background 0.15s, color 0.15s',
                }}
              >
                {l.label}
              </button>
            ))}
            <button
              onClick={toggleTheme}
              style={{ marginTop: 8, textAlign: 'left', padding: '10px 12px', borderRadius: 8, border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 14, color: 'var(--c-muted)' }}
            >
              {theme === 'dark' ? '☀️  Light Mode' : '🌙  Dark Mode'}
            </button>
          </nav>
        </>
      )}
    </>
  )
}
