import React, { useState } from 'react'

const today   = () => new Date().toISOString().slice(0, 10)
const LOG_KEY  = 'ff_water_log'
const GOAL_KEY = 'ff_water_goal'

const loadLog  = () => { try { return JSON.parse(localStorage.getItem(LOG_KEY))  || {} } catch { return {} } }
const loadGoal = () => { try { const v = localStorage.getItem(GOAL_KEY); return v ? parseInt(v) : 8 } catch { return 8 } }

// ── SVG Ring ───────────────────────────────────────────────────
function Ring({ count, goal }) {
  const R    = 72
  const CIRC = 2 * Math.PI * R
  const pct  = Math.min(count / Math.max(goal, 1), 1)
  const off  = CIRC * (1 - pct)
  const color = count >= goal ? '#4ade80' : '#60a5fa'

  return (
    <div style={{ position: 'relative', width: 184, height: 184, flexShrink: 0 }}>
      <svg width={184} height={184} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={92} cy={92} r={R} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={16} />
        <circle
          cx={92} cy={92} r={R} fill="none" stroke={color} strokeWidth={16}
          strokeDasharray={CIRC} strokeDashoffset={off}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.5s ease, stroke 0.4s' }}
        />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
        <div style={{ fontSize: 42, fontWeight: 800, color, lineHeight: 1 }}>{count}</div>
        <div style={{ fontSize: 13, color: 'var(--c-subtle)' }}>of {goal}</div>
        <div style={{ fontSize: 11, color: 'var(--c-subtle)' }}>glasses</div>
      </div>
    </div>
  )
}

export default function Water() {
  const [log,  setLog]  = useState(loadLog)
  const [goal, setGoal] = useState(loadGoal)

  const date  = today()
  const count = log[date] || 0

  const set = (n) => {
    const next = { ...log, [date]: Math.max(0, n) }
    setLog(next)
    localStorage.setItem(LOG_KEY, JSON.stringify(next))
  }

  const saveGoal = (g) => {
    setGoal(g)
    localStorage.setItem(GOAL_KEY, String(g))
  }

  // Past 7 days for bar chart
  const past7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(Date.now() - i * 86400000).toISOString().slice(0, 10)
    return { date: d, count: log[d] || 0, isToday: d === date }
  }).reverse()

  const maxBar = Math.max(goal, ...past7.map(d => d.count), 1)

  return (
    <section>
      <h2>💧 Water Tracker</h2>

      {/* Main card */}
      <div className="card" style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 32, flexWrap: 'wrap' }}>
        <Ring count={count} goal={goal} />

        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ color: 'var(--c-muted)', fontSize: 14, marginBottom: 4 }}>Today — {date}</div>
          <div style={{
            fontWeight: 700, fontSize: 16, marginBottom: 20,
            color: count >= goal ? '#4ade80' : count >= goal * 0.5 ? '#60a5fa' : 'var(--c-muted)'
          }}>
            {count >= goal ? '🎉 Daily goal reached!' : `${goal - count} more glass${goal - count !== 1 ? 'es' : ''} to go`}
          </div>

          {/* Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
            <button
              onClick={() => set(count - 1)}
              style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: 'var(--c-text)', fontSize: 26, cursor: 'pointer', lineHeight: 1 }}
            >−</button>
            <div style={{ fontSize: 22, fontWeight: 700, color: '#60a5fa', minWidth: 100, textAlign: 'center' }}>
              💧 {count} glass{count !== 1 ? 'es' : ''}
            </div>
            <button
              onClick={() => set(count + 1)}
              style={{ width: 48, height: 48, borderRadius: '50%', background: '#60a5fa', border: 'none', color: '#000', fontSize: 26, cursor: 'pointer', fontWeight: 700, lineHeight: 1 }}
            >+</button>
          </div>

          {/* Goal setting */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ color: 'var(--c-subtle)', fontSize: 13 }}>Daily goal:</span>
            <input
              type="number" min={1} max={20} value={goal}
              onChange={e => saveGoal(Math.max(1, parseInt(e.target.value) || 8))}
              className="input" style={{ width: 64 }}
            />
            <span style={{ color: 'var(--c-subtle)', fontSize: 13 }}>glasses</span>
          </div>
        </div>
      </div>

      {/* Glass bubbles quick-tap */}
      <div className="card" style={{ marginTop: 16 }}>
        <h3 style={{ marginTop: 0, marginBottom: 12 }}>Quick Log</h3>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {Array.from({ length: Math.min(goal, 16) }, (_, i) => (
            <button
              key={i}
              onClick={() => set(i < count ? i : i + 1)}
              title={`${i + 1} glass${i !== 0 ? 'es' : ''}`}
              style={{
                fontSize: 26, background: 'none', border: 'none', cursor: 'pointer',
                opacity: i < count ? 1 : 0.2,
                filter: i < count ? 'none' : 'grayscale(1)',
                transition: 'opacity 0.2s, filter 0.2s',
                padding: 2,
              }}
            >💧</button>
          ))}
        </div>
      </div>

      {/* 7-day bar chart */}
      <div className="card" style={{ marginTop: 16 }}>
        <h3 style={{ marginTop: 0, marginBottom: 16 }}>Past 7 Days</h3>
        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', height: 96 }}>
          {past7.map(({ date: d, count: c, isToday }) => {
            const h = Math.round((c / maxBar) * 72)
            return (
              <div key={d} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div style={{ fontSize: 11, color: c > 0 ? (c >= goal ? '#4ade80' : '#60a5fa') : 'var(--c-subtle)' }}>{c || ''}</div>
                <div style={{ width: '100%', height: 72, background: 'rgba(255,255,255,0.04)', borderRadius: 6, overflow: 'hidden', display: 'flex', alignItems: 'flex-end' }}>
                  <div style={{
                    width: '100%', height: h || 2,
                    background: c >= goal ? '#4ade80' : isToday ? '#60a5fa' : 'rgba(96,165,250,0.4)',
                    borderRadius: 6,
                    transition: 'height 0.4s ease',
                  }} />
                </div>
                <div style={{ fontSize: 10, color: isToday ? '#60a5fa' : 'var(--c-subtle)' }}>
                  {isToday ? 'Today' : d.slice(5)}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
