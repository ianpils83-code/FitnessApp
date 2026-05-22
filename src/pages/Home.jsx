import React from 'react'

const ls = (k, fb) => { try { const v = localStorage.getItem(k); return v !== null ? JSON.parse(v) : fb } catch { return fb } }
const today = () => new Date().toISOString().slice(0, 10)
const daysAgo = (n) => new Date(Date.now() - n * 86400000).toISOString().slice(0, 10)

// ── Streak ─────────────────────────────────────────────────────
const calcStreak = (entries) => {
  if (!entries.length) return 0
  const dates = [...new Set(entries.map(e => e.date))].sort().reverse()
  const t = today(), y = daysAgo(1)
  if (dates[0] !== t && dates[0] !== y) return 0
  let streak = 0, check = dates[0]
  for (const d of dates) {
    if (d === check) { streak++; check = new Date(new Date(check).getTime() - 86400000).toISOString().slice(0, 10) }
    else break
  }
  return streak
}

// ── SVG progress ring ──────────────────────────────────────────
function Ring({ value, max, color, label, emoji, size = 90 }) {
  const R    = size * 0.38
  const CIRC = 2 * Math.PI * R
  const pct  = Math.min(value / Math.max(max, 1), 1)
  const off  = CIRC * (1 - pct)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          <circle cx={size/2} cy={size/2} r={R} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={size*0.09} />
          <circle
            cx={size/2} cy={size/2} r={R} fill="none" stroke={color} strokeWidth={size*0.09}
            strokeDasharray={CIRC} strokeDashoffset={off}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.6s ease' }}
          />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ fontSize: size * 0.28 }}>{emoji}</div>
        </div>
      </div>
      <div style={{ fontSize: 12, color: 'var(--c-subtle)', textAlign: 'center' }}>{label}</div>
      <div style={{ fontSize: 13, fontWeight: 700, color, textAlign: 'center', lineHeight: 1.2 }}>
        {value}<span style={{ color: 'var(--c-subtle)', fontWeight: 400 }}>/{max}</span>
      </div>
    </div>
  )
}

export default function Home({ setPage }) {
  const history  = ls('ff_history',  [])
  const streak   = calcStreak(history)
  const last     = [...history].sort((a, b) => b.date.localeCompare(a.date))[0] || null
  const total    = history.length
  const todayStr = today()

  // Today's workout done?
  const trainedToday = history.some(e => e.date === todayStr)

  // Today's calories
  const foodLog   = ls('ff_food_log', {})
  const todayFood = foodLog[todayStr] || []
  const kcalToday = Math.round(todayFood.reduce((s, i) => s + (i.protein * 4 + i.carbs * 4 + i.fat * 9), 0))
  const kcalTarget = (() => {
    const w = ls('ff_weight', 75), h = ls('ff_height', 175), a = ls('ff_age', 30)
    const s = ls('ff_sex', 'male'), act = ls('ff_activity', 1.55), g = ls('ff_goal', 'maintain')
    const bmr = s === 'male' ? 10*w + 6.25*h - 5*a + 5 : 10*w + 6.25*h - 5*a - 161
    const maint = Math.round(bmr * act)
    return g === 'lose' ? maint - 500 : g === 'gain' ? maint + 300 : maint
  })()

  // Today's water
  const waterLog  = ls('ff_water_log', {})
  const waterToday = waterLog[todayStr] || 0
  const waterGoal  = parseInt(localStorage.getItem('ff_water_goal') || '8')

  // Profile
  const name   = ls('ff_profile_name',  '')
  const avatar = ls('ff_profile_emoji', '💪')

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  const streakEmoji = streak >= 14 ? '🏆' : streak >= 7 ? '🔥' : streak >= 3 ? '⚡' : '✅'

  return (
    <section>

      {/* ── Greeting ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, margin: 0 }}>
            {greeting}{name ? `, ${name}` : ''} {avatar}
          </h1>
          <p style={{ color: 'var(--c-muted)', marginTop: 4, fontSize: 14 }}>
            {trainedToday ? '🎉 You trained today — keep the streak alive!' : 'Ready to train? Your next session awaits.'}
          </p>
        </div>
        <button
          onClick={() => setPage('plans')}
          style={{ background: 'linear-gradient(135deg,#ff6a00,#ff9a00)', border: 'none', color: '#fff', padding: '11px 24px', borderRadius: 10, fontWeight: 700, fontSize: 15, cursor: 'pointer', whiteSpace: 'nowrap' }}
        >
          Start Training →
        </button>
      </div>

      {/* ── Today's rings ── */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
          <div style={{ fontWeight: 700, fontSize: 15 }}>Today's Progress</div>
          <div style={{ color: 'var(--c-subtle)', fontSize: 12 }}>{todayStr}</div>
        </div>
        <div style={{ display: 'flex', gap: 24, justifyContent: 'space-around', flexWrap: 'wrap' }}>
          <Ring
            value={trainedToday ? 1 : 0} max={1}
            color={trainedToday ? '#4ade80' : '#e879f9'}
            emoji={trainedToday ? '✅' : '🏋️'}
            label="Workout"
            size={90}
          />
          <Ring
            value={kcalToday} max={kcalTarget}
            color="#fb923c"
            emoji="🍽️"
            label={`${kcalToday} kcal`}
            size={90}
          />
          <Ring
            value={waterToday} max={waterGoal}
            color="#60a5fa"
            emoji="💧"
            label="Water"
            size={90}
          />
          {streak > 0 && (
            <Ring
              value={Math.min(streak, 30)} max={30}
              color="#fb923c"
              emoji={streakEmoji}
              label={`${streak}-day streak`}
              size={90}
            />
          )}
        </div>
      </div>

      {/* ── Stats row ── */}
      {total > 0 && (
        <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
          {[
            { label: 'Total Workouts', value: total,                         color: '#e879f9' },
            { label: 'Current Streak', value: `${streak} ${streakEmoji}`,    color: '#fb923c' },
            { label: 'PRs Tracked',    value: Object.keys(ls('ff_prs',{})).length, color: '#4ade80' },
          ].map(s => (
            <div key={s.label} className="card" style={{ flex: '1 1 100px', textAlign: 'center', padding: '12px 8px' }}>
              <div style={{ color: 'var(--c-subtle)', fontSize: 11, marginBottom: 4 }}>{s.label}</div>
              <div style={{ color: s.color, fontSize: 22, fontWeight: 800 }}>{s.value}</div>
            </div>
          ))}
        </div>
      )}

      {/* ── Last workout ── */}
      {last && (
        <div style={{ marginBottom: 16, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 24 }}>{last.planEmoji}</span>
          <div style={{ flex: 1 }}>
            <span style={{ color: 'var(--c-subtle)', fontSize: 12 }}>Last workout: </span>
            <span style={{ color: 'var(--c-muted)', fontSize: 13, fontWeight: 600 }}>{last.dayLabel}</span>
            <span style={{ color: 'var(--c-subtle)', fontSize: 12 }}> · {last.date}</span>
          </div>
          <button onClick={() => setPage('history')} style={{ background: 'none', border: 'none', color: '#e879f9', fontSize: 12, cursor: 'pointer' }}>
            View history →
          </button>
        </div>
      )}

      {/* ── Quick actions ── */}
      <h3 style={{ marginBottom: 10, color: 'var(--c-muted)', fontWeight: 600, fontSize: 14 }}>QUICK ACTIONS</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px,1fr))', gap: 10, marginBottom: 24 }}>
        {[
          { emoji: '🏋️', label: 'Start Workout', page: 'plans',    color: '#e879f9' },
          { emoji: '🍽️', label: 'Log Meal',      page: 'macros',   color: '#fb923c' },
          { emoji: '💧', label: 'Log Water',     page: 'water',    color: '#60a5fa' },
          { emoji: '⚖️', label: 'Log Weight',    page: 'progress', color: '#4ade80' },
          { emoji: '📏', label: 'Measurements',  page: 'measurements', color: '#f87171' },
          { emoji: '📆', label: 'Weekly Recap',  page: 'weekly',   color: '#a78bfa' },
        ].map(a => (
          <button
            key={a.label}
            onClick={() => setPage(a.page)}
            style={{
              background: 'rgba(255,255,255,0.04)', border: `1px solid rgba(255,255,255,0.08)`,
              borderRadius: 12, padding: '14px 10px', cursor: 'pointer',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
              transition: 'background 0.2s, border-color 0.2s, transform 0.15s',
              color: 'var(--c-text)',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = a.color + '55'; e.currentTarget.style.background = a.color + '12'; e.currentTarget.style.transform = 'translateY(-2px)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.transform = 'translateY(0)' }}
          >
            <span style={{ fontSize: 24 }}>{a.emoji}</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--c-muted)' }}>{a.label}</span>
          </button>
        ))}
      </div>

      {/* ── Everything in one place ── */}
      <h3 style={{ marginBottom: 10, color: 'var(--c-muted)', fontWeight: 600, fontSize: 14 }}>ALL FEATURES</h3>
      <div className="grid">
        {[
          { icon: '📚', label: 'Library',    desc: '30 exercises with tips + PR logging',  page: 'library'    },
          { icon: '🧮', label: 'Calculator', desc: 'BMR, BMI, macros and 1RM',             page: 'calculator' },
          { icon: '🥗', label: 'Diet Guide', desc: 'Goal-specific nutrition guidance',      page: 'diet'       },
          { icon: '📈', label: 'Progress',   desc: 'Weight chart with export',              page: 'progress'   },
          { icon: '🏅', label: 'Records',    desc: 'Personal bests across all lifts',       page: 'records'    },
          { icon: '🗓️', label: 'History',    desc: 'Full workout log with calorie burn',    page: 'history'    },
          { icon: '👤', label: 'Profile',    desc: 'Avatar, stats and achievements',         page: 'profile'    },
        ].map(f => (
          <div
            key={f.label}
            className="card"
            onClick={() => setPage(f.page)}
            style={{ cursor: 'pointer', padding: '14px 16px' }}
          >
            <span style={{ fontSize: 24 }}>{f.icon}</span>
            <div style={{ fontWeight: 700, marginTop: 8, marginBottom: 4 }}>{f.label}</div>
            <div style={{ color: 'var(--c-subtle)', fontSize: 12 }}>{f.desc}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
