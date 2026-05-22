import React, { useState } from 'react'

// ── Calorie burn estimate ──────────────────────────────────────
const estimateKcal = (entries) => {
  const weight = (() => { try { const v = localStorage.getItem('ff_weight'); return v ? JSON.parse(v) : 70 } catch { return 70 } })()
  const totalEx = entries.reduce((s, e) => s + (e.exerciseCount || 5), 0)
  const minutes = totalEx * 9          // ~3 sets × 3 min per exercise
  return Math.round((weight * 5.0 * minutes / 60) / 10) * 10
}

// ── Share workout as PNG ───────────────────────────────────────
const shareWorkout = (date, entries, fmtDateFn) => {
  const W = 560, H = Math.max(300, 140 + entries.length * 80)
  const canvas = document.createElement('canvas')
  canvas.width = W * 2; canvas.height = H * 2   // retina
  const ctx = canvas.getContext('2d')
  ctx.scale(2, 2)

  // Background
  ctx.fillStyle = '#0d0d0d'
  ctx.fillRect(0, 0, W, H)

  // Orange header bar
  ctx.fillStyle = '#ff6a00'
  ctx.fillRect(0, 0, W, 56)

  // FitForge brand
  ctx.fillStyle = '#000'
  ctx.font = 'bold 22px system-ui, -apple-system, sans-serif'
  ctx.fillText('FitForge', 20, 38)

  // Date top-right
  ctx.textAlign = 'right'
  ctx.font = '13px system-ui, -apple-system, sans-serif'
  ctx.fillText(fmtDateFn(date), W - 20, 36)
  ctx.textAlign = 'left'

  // Workouts
  let y = 88
  for (const e of entries) {
    // Emoji circle
    ctx.fillStyle = '#1a1a1a'
    ctx.beginPath(); ctx.arc(36, y, 20, 0, Math.PI * 2); ctx.fill()
    ctx.font = '20px system-ui'
    ctx.textAlign = 'center'
    ctx.fillText(e.planEmoji || '🏋️', 36, y + 7)
    ctx.textAlign = 'left'

    // Plan info
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 15px system-ui, -apple-system, sans-serif'
    ctx.fillText(e.dayLabel, 68, y - 6)
    ctx.fillStyle = '#888'
    ctx.font = '13px system-ui, -apple-system, sans-serif'
    ctx.fillText(`${e.planTitle}  ·  ${e.exerciseCount} exercises`, 68, y + 12)

    y += 72
  }

  // Kcal estimate
  const kcal = estimateKcal(entries)
  ctx.fillStyle = '#4ade8033'
  ctx.fillRect(20, y - 20, W - 40, 36)
  ctx.fillStyle = '#4ade80'
  ctx.font = 'bold 14px system-ui, -apple-system, sans-serif'
  ctx.fillText(`🔥 Est. ~${kcal} kcal burned`, 36, y + 3)

  // Footer
  ctx.fillStyle = '#1a1a1a'
  ctx.fillRect(0, H - 30, W, 30)
  ctx.fillStyle = '#444'
  ctx.font = '11px system-ui, -apple-system, sans-serif'
  ctx.fillText('Generated with FitForge', 20, H - 10)

  const a = document.createElement('a')
  a.download = `fitforge-workout-${date}.png`
  a.href = canvas.toDataURL('image/png')
  a.click()
}

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
            <div style={{ display: 'flex', gap: 8, alignItems: 'stretch' }}>
              <button
                onClick={() => setExpanded(expanded === date ? null : date)}
                style={{
                  flex: 1, textAlign: 'left', background: '#1a1a1a',
                  border: '1px solid #2a2a2a', color: '#fff', padding: '10px 16px',
                  borderRadius: 10, cursor: 'pointer', fontWeight: 600, fontSize: 14,
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                }}
              >
                <span>📅 {fmtDate(date)}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ color: '#4ade80', fontSize: 12 }}>🔥 ~{estimateKcal(entries)} kcal</span>
                  <span style={{ color: '#e879f9', fontSize: 12 }}>{entries.length} workout{entries.length > 1 ? 's' : ''}</span>
                  <span style={{ color: '#555' }}>{expanded === date ? '▲' : '▼'}</span>
                </div>
              </button>
              <button
                onClick={() => shareWorkout(date, entries, fmtDate)}
                title="Share as image"
                style={{
                  background: '#1a1a1a', border: '1px solid #2a2a2a', color: '#888',
                  padding: '0 14px', borderRadius: 10, cursor: 'pointer', fontSize: 16,
                  flexShrink: 0
                }}
              >📤</button>
            </div>

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
                      {e.note && (
                        <div style={{ color: '#555', fontSize: 11, marginTop: 3, fontStyle: 'italic' }}>
                          💬 {e.note}
                        </div>
                      )}
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
