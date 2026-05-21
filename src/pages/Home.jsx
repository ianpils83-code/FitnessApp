import React from 'react'

// ── Streak helpers (same logic as History.jsx) ─────────────────
const calcStreak = (entries) => {
  if (!entries.length) return 0
  const dates = [...new Set(entries.map(e => e.date))].sort().reverse()
  const today     = new Date().toISOString().slice(0, 10)
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10)
  if (dates[0] !== today && dates[0] !== yesterday) return 0
  let streak = 0
  let check  = dates[0] === today ? today : yesterday
  for (const d of dates) {
    if (d === check) {
      streak++
      check = new Date(new Date(check).getTime() - 86400000).toISOString().slice(0, 10)
    } else break
  }
  return streak
}

const getStats = () => {
  try {
    const history = JSON.parse(localStorage.getItem('ff_history')) || []
    const streak  = calcStreak(history)
    const last    = history[0] || null
    return { streak, last, total: history.length }
  } catch { return { streak: 0, last: null, total: 0 } }
}

const QUICK_PICKS = [
  { id: 1, emoji: '🔥', title: 'Fat Loss Starter',  desc: 'Short, intense circuits to burn calories and build conditioning.'  },
  { id: 2, emoji: '💪', title: 'Muscle Builder',     desc: 'Evidence-based hypertrophy split focused on progressive overload.' },
  { id: 3, emoji: '🏋️', title: 'Beginner Strength',  desc: 'Simple compound lifts and clear progressions for new gym-goers.'  },
]

export default function Home({ setPage }) {
  const { streak, last, total } = getStats()

  return (
    <section>
      {/* Hero */}
      <div className="hero card">
        <div className="left">
          <h1>Train hard. Eat smart. Transform.</h1>
          <p>Workout plans, exercise library, calorie calculator, macro logger and progress tracker — all in one app.</p>
          <button
            onClick={() => setPage('plans')}
            style={{
              marginTop: 14, background: '#ff6a00', border: 'none', color: '#fff',
              padding: '10px 24px', borderRadius: 10, fontWeight: 700,
              fontSize: 15, cursor: 'pointer'
            }}
          >
            Start Training →
          </button>
        </div>
        <div className="right">
          <img
            src="https://images.unsplash.com/photo-1605296867304-46d5465a13f1?auto=format&fit=crop&w=520&h=380"
            alt="workout"
            style={{ width: 260, borderRadius: 12, objectFit: 'cover' }}
          />
        </div>
      </div>

      {/* Streak Banner */}
      {streak > 0 && (
        <div style={{
          marginTop: 18,
          background: streak >= 7 ? '#fb923c22' : streak >= 3 ? '#e879f922' : '#ffffff0a',
          border: `1px solid ${streak >= 7 ? '#fb923c55' : streak >= 3 ? '#e879f955' : '#2a2a2a'}`,
          borderRadius: 12, padding: '14px 20px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <span style={{ fontSize: 36 }}>
              {streak >= 14 ? '🏆' : streak >= 7 ? '🔥' : streak >= 3 ? '⚡' : '✅'}
            </span>
            <div>
              <div style={{ fontWeight: 700, fontSize: 18, color: streak >= 7 ? '#fb923c' : '#e879f9' }}>
                {streak}-day streak!
              </div>
              <div style={{ color: '#888', fontSize: 13, marginTop: 2 }}>
                {streak >= 14 ? 'Legendary consistency 🏆'
                  : streak >= 7  ? 'One full week — keep pushing! 🔥'
                  : streak >= 3  ? 'Building momentum ⚡'
                  : 'Great start — come back tomorrow!'}
              </div>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ color: '#555', fontSize: 12 }}>Total workouts logged</div>
            <div style={{ color: '#fff', fontSize: 22, fontWeight: 700 }}>{total}</div>
          </div>
        </div>
      )}

      {/* Last workout */}
      {last && (
        <div style={{ marginTop: 10, background: '#111', border: '1px solid #1e1e1e', borderRadius: 10, padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 22 }}>{last.planEmoji}</span>
          <div style={{ flex: 1 }}>
            <span style={{ color: '#555', fontSize: 12 }}>Last workout: </span>
            <span style={{ color: '#bbb', fontSize: 13 }}>{last.dayLabel}</span>
            <span style={{ color: '#444', fontSize: 12 }}> · {last.date}</span>
          </div>
          <button
            onClick={() => setPage('history')}
            style={{ background: 'none', border: 'none', color: '#e879f9', fontSize: 12, cursor: 'pointer' }}
          >
            View history →
          </button>
        </div>
      )}

      {/* Quick Picks */}
      <h2 style={{ marginTop: 22 }}>Quick Picks</h2>
      <div className="grid" style={{ marginTop: 12 }}>
        {QUICK_PICKS.map(p => (
          <div
            key={p.id}
            className="card"
            onClick={() => setPage('plans')}
            style={{ cursor: 'pointer', transition: 'border-color 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.borderColor = '#ff6a00'}
            onMouseLeave={e => e.currentTarget.style.borderColor = ''}
          >
            <div style={{ fontSize: 26, marginBottom: 6 }}>{p.emoji}</div>
            <h3 style={{ margin: 0 }}>{p.title}</h3>
            <p style={{ color: '#bbb', marginTop: 6, fontSize: 14 }}>{p.desc}</p>
            <div style={{ color: '#ff6a00', fontSize: 12, marginTop: 10 }}>View plan →</div>
          </div>
        ))}
      </div>

      {/* App feature grid */}
      <h2 style={{ marginTop: 26 }}>Everything in one place</h2>
      <div className="grid" style={{ marginTop: 12 }}>
        {[
          { icon: '📚', label: 'Library',    desc: '30 exercises with tips + PR logging',  page: 'library'    },
          { icon: '🍽️', label: 'Macros',     desc: 'Log meals, track macros vs targets',   page: 'macros'     },
          { icon: '📈', label: 'Progress',   desc: 'Weight chart and body tracking',        page: 'progress'   },
          { icon: '🏅', label: 'Records',    desc: 'Personal bests across all exercises',   page: 'records'    },
          { icon: '🗓️', label: 'History',    desc: 'Full log of every workout completed',   page: 'history'    },
          { icon: '🧮', label: 'Calculator', desc: 'BMR, BMI and personalised macros',      page: 'calculator' },
        ].map(f => (
          <div
            key={f.label}
            className="card"
            onClick={() => setPage(f.page)}
            style={{ cursor: 'pointer', transition: 'border-color 0.2s', padding: '14px 16px' }}
            onMouseEnter={e => e.currentTarget.style.borderColor = '#e879f9'}
            onMouseLeave={e => e.currentTarget.style.borderColor = ''}
          >
            <span style={{ fontSize: 24 }}>{f.icon}</span>
            <div style={{ fontWeight: 700, marginTop: 6 }}>{f.label}</div>
            <div style={{ color: '#666', fontSize: 12, marginTop: 4 }}>{f.desc}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
