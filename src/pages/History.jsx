import React, { useState } from 'react'

const HX_KEY  = 'ff_history'
const loadHx  = () => { try { return JSON.parse(localStorage.getItem(HX_KEY)) || [] } catch { return [] } }
const saveHx  = (h) => localStorage.setItem(HX_KEY, JSON.stringify(h))

// ── Streak calculator ──────────────────────────────────────────
const calcStreak = (entries) => {
  if (!entries.length) return 0
  const dates = [...new Set(entries.map(e => e.date))].sort().reverse()
  const today = new Date().toISOString().slice(0, 10)
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10)
  if (dates[0] !== today && dates[0] !== yesterday) return 0
  let streak = 0
  let check  = dates[0] === today ? today : yesterday
  for (const d of dates) {
    if (d === check) {
      streak++
      const prev = new Date(new Date(check).getTime() - 86400000)
      check = prev.toISOString().slice(0, 10)
    } else break
  }
  return streak
}

// ── Group entries by date ──────────────────────────────────────
const groupByDate = (entries) => {
  const map = {}
  for (const e of entries) {
    if (!map[e.date]) map[e.date] = []
    map[e.date].push(e)
  }
  return Object.entries(map).sort((a, b) => b[0].localeCompare(a[0]))
}

const fmtDate = (d) => new Date(d + 'T00:00:00').toLocaleDateString('en-SG', {
  weekday: 'short', day: 'numeric', month: 'short', year: 'numeric'
})

export default function History() {
  const [history,  setHistory]  = useState(loadHx)
  const [expanded, setExpanded] = useState(null)

  const streak  = calcStreak(history)
  const grouped = groupByDate(history)
  const plans   = [...new Set(history.map(e => e.planTitle))]

  const deleteEntry = (id) => {
    const next = history.filter(e => e.id !== id)
    setHistory(next)
    saveHx(next)
  }

  const clearAll = () => {
    if (!window.confirm('Clear entire workout history?')) return
    setHistory([])
    saveHx([])
  }

  // Empty state
  if (!history.length) {
    return (
      <section>
        <h2>🗓️ Workout History</h2>
        <div className="card" style={{ marginTop: 16, textAlign: 'center', padding: '48px 24px' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📋</div>
          <h3 style={{ color: '#bbb', fontWeight: 400 }}>No workouts logged yet</h3>
          <p style={{ color: '#555' }}>
            Go to <strong style={{ color: '#e879f9' }}>Plans</strong>, complete a day,
            then tap <strong style={{ color: '#4ade80' }}>📝 Log Workout</strong> to record it here.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
        <h2 style={{ margin: 0 }}>🗓️ Workout History</h2>
        <button
          onClick={clearAll}
          style={{ background: 'none', border: '1px solid #333', color: '#555', padding: '5px 14px', borderRadius: 8, cursor: 'pointer', fontSize: 13 }}
        >
          Clear All
        </button>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'flex', gap: 12, marginTop: 16, flexWrap: 'wrap' }}>
        {[
          { label: 'Total Workouts',  value: history.length,     color: '#e879f9' },
          { label: 'Current Streak',  value: `${streak} 🔥`,     color: '#fb923c' },
          { label: 'Days Trained',    value: grouped.length,     color: '#4ade80' },
          { label: 'Plans Used',      value: plans.length,       color: '#60a5fa' },
        ].map(s => (
          <div key={s.label} className="card" style={{ flex: '1 1 100px', textAlign: 'center', padding: '12px 8px' }}>
            <div style={{ color: '#666', fontSize: 11, marginBottom: 4 }}>{s.label}</div>
            <div style={{ color: s.color, fontSize: 22, fontWeight: 700 }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Streak banner */}
      {streak >= 3 && (
        <div style={{ marginTop: 16, background: '#fb923c22', border: '1px solid #fb923c44', borderRadius: 10, padding: '10px 16px', color: '#fb923c', fontWeight: 700 }}>
          🔥 {streak}-day streak! Keep it going!
        </div>
      )}

      {/* History list grouped by date */}
      <div style={{ marginTop: 16 }}>
        {grouped.map(([date, entries]) => (
          <div key={date} style={{ marginBottom: 12 }}>
            {/* Date header */}
            <button
              onClick={() => setExpanded(expanded === date ? null : date)}
              style={{
                width: '100%', textAlign: 'left', background: '#1a1a1a',
                border: '1px solid #2a2a2a', color: '#fff', padding: '10px 16px',
                borderRadius: 10, cursor: 'pointer', fontWeight: 600, fontSize: 14,
                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
              }}
            >
              <span>📅 {fmtDate(date)}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ color: '#4ade80', fontSize: 12 }}>{entries.length} workout{entries.length > 1 ? 's' : ''}</span>
                <span style={{ color: '#555' }}>{expanded === date ? '▲' : '▼'}</span>
              </div>
            </button>

            {/* Entries */}
            {expanded === date && (
              <div style={{ border: '1px solid #2a2a2a', borderTop: 'none', borderRadius: '0 0 10px 10px', overflow: 'hidden' }}>
                {entries.map((e, i) => (
                  <div
                    key={e.id}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      padding: '12px 16px',
                      borderBottom: i < entries.length - 1 ? '1px solid #1a1a1a' : 'none',
                      background: '#111'
                    }}
                  >
                    <span style={{ fontSize: 24 }}>{e.planEmoji}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: 14, color: '#fff' }}>{e.dayLabel}</div>
                      <div style={{ color: '#666', fontSize: 12, marginTop: 2 }}>
                        {e.planTitle} · Week {e.weekLabel} · {e.exerciseCount} exercises
                      </div>
                    </div>
                    <button
                      onClick={() => deleteEntry(e.id)}
                      style={{ background: 'none', border: 'none', color: '#333', cursor: 'pointer', fontSize: 18 }}
                      title="Remove entry"
                    >×</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
