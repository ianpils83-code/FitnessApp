import React from 'react'

const ls = (k, fb) => { try { const v = localStorage.getItem(k); return v !== null ? JSON.parse(v) : fb } catch { return fb } }
const today   = () => new Date().toISOString().slice(0, 10)
const daysAgo = (n) => new Date(Date.now() - n * 86400000).toISOString().slice(0, 10)

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

// ── SVG Progress Ring ──────────────────────────────────────────
function Ring({ value, max, color, emoji, label, size = 90 }) {
  const R    = size * 0.38
  const CIRC = 2 * Math.PI * R
  const pct  = Math.min(value / Math.max(max, 1), 1)
  const off  = CIRC * (1 - pct)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          <circle cx={size/2} cy={size/2} r={R} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={size*0.09} />
          <circle cx={size/2} cy={size/2} r={R} fill="none" stroke={color} strokeWidth={size*0.09}
            strokeDasharray={CIRC} strokeDashoffset={off} strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.6s ease' }}
          />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ fontSize: size * 0.28 }}>{emoji}</div>
        </div>
      </div>
      <div style={{ fontSize: 11, color: 'var(--c-subtle)', textAlign: 'center' }}>{label}</div>
      <div style={{ fontSize: 13, fontWeight: 700, color, textAlign: 'center' }}>
        {value}<span style={{ color: 'var(--c-subtle)', fontWeight: 400 }}>/{max}</span>
      </div>
    </div>
  )
}

// ── Activity Heatmap (35 days) ─────────────────────────────────
function Heatmap({ history }) {
  const workoutDates = new Set(history.map(e => e.date))
  const countByDate  = {}
  for (const e of history) countByDate[e.date] = (countByDate[e.date] || 0) + 1

  const todayStr = today()
  const DAYS = 35
  const cells = Array.from({ length: DAYS }, (_, i) => {
    const d = daysAgo(DAYS - 1 - i)
    return { date: d, count: countByDate[d] || 0, isToday: d === todayStr }
  })

  const DAY_LABELS = ['M','T','W','T','F','S','S']
  // Which col is today? (0=Mon…6=Sun)
  const todayDow = (new Date().getDay() + 6) % 7  // convert Sun=0 to Mon=0

  const color = (count) => {
    if (count === 0) return 'rgba(255,255,255,0.05)'
    if (count === 1) return 'rgba(232,121,249,0.45)'
    return '#e879f9'
  }

  return (
    <div className="card" style={{ marginBottom: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div style={{ fontWeight: 700, fontSize: 15 }}>🗓️ Activity — Last 5 Weeks</div>
        <div style={{ fontSize: 12, color: 'var(--c-subtle)' }}>
          {workoutDates.size} day{workoutDates.size !== 1 ? 's' : ''} trained
        </div>
      </div>

      {/* Day-of-week labels */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 4, paddingLeft: 2 }}>
        {DAY_LABELS.map((d, i) => (
          <div key={i} style={{ width: 22, fontSize: 9, color: 'var(--c-subtle)', textAlign: 'center' }}>{d}</div>
        ))}
      </div>

      {/* Grid: 5 rows × 7 cols */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {Array.from({ length: 5 }, (_, row) => (
          <div key={row} style={{ display: 'flex', gap: 4 }}>
            {Array.from({ length: 7 }, (_, col) => {
              const idx  = row * 7 + col
              const cell = cells[idx]
              return (
                <div
                  key={col}
                  title={cell ? `${cell.date}${cell.count ? ` — ${cell.count} workout${cell.count > 1 ? 's' : ''}` : ''}` : ''}
                  style={{
                    width: 22, height: 22, borderRadius: 5,
                    background: cell ? color(cell.count) : 'rgba(255,255,255,0.04)',
                    border: cell?.isToday ? '1.5px solid #e879f9' : '1.5px solid transparent',
                    transition: 'background 0.2s',
                    cursor: 'default',
                  }}
                />
              )
            })}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 10 }}>
        <span style={{ color: 'var(--c-subtle)', fontSize: 11 }}>Less</span>
        {['rgba(255,255,255,0.05)', 'rgba(232,121,249,0.3)', 'rgba(232,121,249,0.6)', '#e879f9'].map((c, i) => (
          <div key={i} style={{ width: 14, height: 14, borderRadius: 3, background: c }} />
        ))}
        <span style={{ color: 'var(--c-subtle)', fontSize: 11 }}>More</span>
      </div>
    </div>
  )
}

// ── Hero illustration SVG ──────────────────────────────────────
function HeroArt() {
  return (
    <svg width="220" height="160" viewBox="0 0 220 160" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
      {/* Glow blobs */}
      <ellipse cx="110" cy="80" rx="90" ry="60" fill="url(#blob1)" opacity="0.35" />
      <ellipse cx="160" cy="50" rx="50" ry="35" fill="url(#blob2)" opacity="0.25" />

      {/* Dumbbell */}
      <rect x="70" y="74" width="80" height="12" rx="6" fill="rgba(255,255,255,0.12)" />
      <rect x="58" y="62" width="20" height="36" rx="6" fill="rgba(255,106,0,0.7)" />
      <rect x="62" y="58" width="12" height="44" rx="4" fill="rgba(255,106,0,0.9)" />
      <rect x="142" y="62" width="20" height="36" rx="6" fill="rgba(255,106,0,0.7)" />
      <rect x="146" y="58" width="12" height="44" rx="4" fill="rgba(255,106,0,0.9)" />

      {/* Progress arc */}
      <circle cx="170" cy="38" r="22" stroke="rgba(255,255,255,0.08)" strokeWidth="4" fill="none" />
      <circle cx="170" cy="38" r="22" stroke="#e879f9" strokeWidth="4" fill="none"
        strokeDasharray="138" strokeDashoffset="35" strokeLinecap="round"
        style={{ transformOrigin: '170px 38px', transform: 'rotate(-90deg)' }}
      />
      <text x="170" y="43" textAnchor="middle" fill="#e879f9" fontSize="11" fontWeight="700">75%</text>

      {/* Chart line */}
      <polyline points="22,120 48,105 72,112 96,90 120,95 144,72 168,78 192,55"
        stroke="#4ade80" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.8"
      />
      {/* Chart dots */}
      {[[48,105],[96,90],[144,72],[192,55]].map(([x,y],i) => (
        <circle key={i} cx={x} cy={y} r="4" fill="#4ade80" stroke="#0d0d18" strokeWidth="2" />
      ))}

      {/* Sparkle stars */}
      <circle cx="40" cy="35" r="3" fill="#fb923c" opacity="0.8" />
      <circle cx="200" cy="110" r="2.5" fill="#60a5fa" opacity="0.7" />
      <circle cx="25" cy="75" r="2" fill="#e879f9" opacity="0.6" />

      <defs>
        <radialGradient id="blob1" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#e879f9" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        <radialGradient id="blob2" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ff6a00" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
    </svg>
  )
}

// ── Mini weight sparkline ──────────────────────────────────────
function WeightSparkline({ progress }) {
  if (progress.length < 2) return null
  const last7 = progress.slice(-7)
  const vals  = last7.map(e => e.weight)
  const min   = Math.min(...vals), max = Math.max(...vals)
  const range = max - min || 1
  const W = 120, H = 36, PAD = 4

  const pts = last7.map((e, i) => {
    const x = PAD + (i / (last7.length - 1)) * (W - PAD * 2)
    const y = H - PAD - ((e.weight - min) / range) * (H - PAD * 2)
    return `${x},${y}`
  }).join(' ')

  const first = vals[0], last = vals[vals.length - 1]
  const up = last > first

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <svg width={W} height={H} style={{ overflow: 'visible' }}>
        <polyline points={pts} fill="none" stroke={up ? '#fb923c' : '#4ade80'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={pts.split(' ').at(-1).split(',')[0]} cy={pts.split(' ').at(-1).split(',')[1]} r="3.5" fill={up ? '#fb923c' : '#4ade80'} />
      </svg>
      <div>
        <div style={{ fontSize: 18, fontWeight: 800, color: up ? '#fb923c' : '#4ade80' }}>{last} kg</div>
        <div style={{ fontSize: 11, color: 'var(--c-subtle)' }}>
          {up ? '▲' : '▼'} {Math.abs(last - first).toFixed(1)} kg (7d)
        </div>
      </div>
    </div>
  )
}

// ── Main ───────────────────────────────────────────────────────
export default function Home({ setPage }) {
  const history  = ls('ff_history',  [])
  const progress = ls('ff_progress', [])
  const streak   = calcStreak(history)
  const last     = [...history].sort((a, b) => b.date.localeCompare(a.date))[0] || null
  const total    = history.length
  const todayStr = today()

  const trainedToday = history.some(e => e.date === todayStr)

  // Calories
  const foodLog    = ls('ff_food_log', {})
  const todayFood  = foodLog[todayStr] || []
  const kcalToday  = Math.round(todayFood.reduce((s, i) => s + (i.protein * 4 + i.carbs * 4 + i.fat * 9), 0))
  const kcalTarget = (() => {
    const w = ls('ff_weight',75), h = ls('ff_height',175), a = ls('ff_age',30)
    const s = ls('ff_sex','male'), act = ls('ff_activity',1.55), g = ls('ff_goal','maintain')
    const bmr = s === 'male' ? 10*w+6.25*h-5*a+5 : 10*w+6.25*h-5*a-161
    const maint = Math.round(bmr * act)
    return g === 'lose' ? maint-500 : g === 'gain' ? maint+300 : maint
  })()

  // Water
  const waterLog   = ls('ff_water_log', {})
  const waterToday = waterLog[todayStr] || 0
  const waterGoal  = parseInt(localStorage.getItem('ff_water_goal') || '8')

  // Profile
  const name   = ls('ff_profile_name',  '')
  const avatar = ls('ff_profile_emoji', '💪')

  const hour     = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const streakEmoji = streak >= 14 ? '🏆' : streak >= 7 ? '🔥' : streak >= 3 ? '⚡' : '✅'

  return (
    <section>

      {/* ── Hero banner ── */}
      <div className="card" style={{
        marginBottom: 16,
        background: 'linear-gradient(135deg, rgba(255,106,0,0.15) 0%, rgba(232,121,249,0.12) 50%, rgba(96,165,250,0.1) 100%)',
        border: '1px solid rgba(255,106,0,0.2)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: 16, overflow: 'hidden', padding: '22px 24px',
      }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, margin: 0, lineHeight: 1.2 }}>
            {greeting}{name ? `, ${name}` : ''} {avatar}
          </h1>
          <p style={{ color: 'var(--c-muted)', marginTop: 8, fontSize: 14, lineHeight: 1.5, maxWidth: 340 }}>
            {trainedToday
              ? '🎉 You trained today — streak is alive!'
              : 'Every rep counts. Your next session is waiting.'}
          </p>
          <button
            onClick={() => setPage('plans')}
            style={{ marginTop: 14, background: 'linear-gradient(135deg,#ff6a00,#ff9a00)', border: 'none', color: '#fff', padding: '10px 22px', borderRadius: 10, fontWeight: 700, fontSize: 14, cursor: 'pointer' }}
          >
            Start Training →
          </button>
        </div>
        <HeroArt />
      </div>

      {/* ── Today's rings ── */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
          <div style={{ fontWeight: 700, fontSize: 15 }}>Today's Progress</div>
          <div style={{ color: 'var(--c-subtle)', fontSize: 12 }}>{todayStr}</div>
        </div>
        <div style={{ display: 'flex', gap: 20, justifyContent: 'space-around', flexWrap: 'wrap' }}>
          <Ring value={trainedToday ? 1 : 0} max={1} color={trainedToday ? '#4ade80' : '#e879f9'} emoji={trainedToday ? '✅' : '🏋️'} label="Workout" />
          <Ring value={kcalToday} max={kcalTarget} color="#fb923c" emoji="🍽️" label={`${kcalToday} kcal`} />
          <Ring value={waterToday} max={waterGoal} color="#60a5fa" emoji="💧" label="Water" />
          {streak > 0 && <Ring value={Math.min(streak, 30)} max={30} color="#fb923c" emoji={streakEmoji} label={`${streak}-day streak`} />}
        </div>
      </div>

      {/* ── Stats + weight trend ── */}
      {total > 0 && (
        <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
          {[
            { label: 'Total Workouts', value: total,   color: '#e879f9' },
            { label: 'Days Streak',    value: streak,   color: '#fb923c' },
            { label: 'PRs Tracked',    value: Object.keys(ls('ff_prs',{})).length, color: '#4ade80' },
          ].map(s => (
            <div key={s.label} className="card" style={{ flex: '1 1 90px', textAlign: 'center', padding: '12px 8px' }}>
              <div style={{ color: 'var(--c-subtle)', fontSize: 11, marginBottom: 4 }}>{s.label}</div>
              <div style={{ color: s.color, fontSize: 24, fontWeight: 800 }}>{s.value}</div>
            </div>
          ))}
          {progress.length >= 2 && (
            <div className="card" style={{ flex: '1 1 160px', padding: '12px 14px', display: 'flex', alignItems: 'center' }}>
              <div>
                <div style={{ color: 'var(--c-subtle)', fontSize: 11, marginBottom: 8 }}>Weight Trend (7d)</div>
                <WeightSparkline progress={progress} />
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Activity heatmap ── */}
      <Heatmap history={history} />

      {/* ── Last workout ── */}
      {last && (
        <div style={{ marginBottom: 16, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 24 }}>{last.planEmoji}</span>
          <div style={{ flex: 1 }}>
            <span style={{ color: 'var(--c-subtle)', fontSize: 12 }}>Last workout: </span>
            <span style={{ color: 'var(--c-muted)', fontSize: 13, fontWeight: 600 }}>{last.dayLabel}</span>
            <span style={{ color: 'var(--c-subtle)', fontSize: 12 }}> · {last.date}</span>
          </div>
          <button onClick={() => setPage('history')} style={{ background: 'none', border: 'none', color: '#e879f9', fontSize: 12, cursor: 'pointer' }}>View history →</button>
        </div>
      )}

      {/* ── Quick actions ── */}
      <h3 style={{ marginBottom: 10, color: 'var(--c-subtle)', fontWeight: 600, fontSize: 12, letterSpacing: '0.08em' }}>QUICK ACTIONS</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px,1fr))', gap: 10, marginBottom: 24 }}>
        {[
          { emoji: '🏋️', label: 'Start Workout', page: 'plans',        color: '#e879f9' },
          { emoji: '🍽️', label: 'Log Meal',      page: 'macros',       color: '#fb923c' },
          { emoji: '💧', label: 'Log Water',     page: 'water',        color: '#60a5fa' },
          { emoji: '⚖️', label: 'Log Weight',    page: 'progress',     color: '#4ade80' },
          { emoji: '📏', label: 'Measurements',  page: 'measurements', color: '#f87171' },
          { emoji: '📆', label: 'Weekly Recap',  page: 'weekly',       color: '#a78bfa' },
        ].map(a => (
          <button
            key={a.label}
            onClick={() => setPage(a.page)}
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '14px 10px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, transition: 'background 0.2s, border-color 0.2s, transform 0.15s', color: 'var(--c-text)' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = a.color+'55'; e.currentTarget.style.background = a.color+'12'; e.currentTarget.style.transform = 'translateY(-2px)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.transform = 'translateY(0)' }}
          >
            <span style={{ fontSize: 24 }}>{a.emoji}</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--c-muted)' }}>{a.label}</span>
          </button>
        ))}
      </div>

      {/* ── All features ── */}
      <h3 style={{ marginBottom: 10, color: 'var(--c-subtle)', fontWeight: 600, fontSize: 12, letterSpacing: '0.08em' }}>ALL FEATURES</h3>
      <div className="grid">
        {[
          { icon: '📚', label: 'Library',    desc: '30 exercises with tips + PR logging',  page: 'library'    },
          { icon: '🧮', label: 'Calculator', desc: 'BMR, BMI, macros and 1RM',             page: 'calculator' },
          { icon: '🥗', label: 'Diet Guide', desc: 'Goal-specific nutrition guidance',      page: 'diet'       },
          { icon: '📈', label: 'Progress',   desc: 'Weight chart with export',              page: 'progress'   },
          { icon: '🏅', label: 'Records',    desc: 'Personal bests across all lifts',       page: 'records'    },
          { icon: '🗓️', label: 'History',    desc: 'Full workout log with calorie burn',    page: 'history'    },
          { icon: '👤', label: 'Profile',    desc: 'Avatar, stats and achievement badges',  page: 'profile'    },
        ].map(f => (
          <div key={f.label} className="card" onClick={() => setPage(f.page)} style={{ cursor: 'pointer', padding: '14px 16px' }}>
            <span style={{ fontSize: 24 }}>{f.icon}</span>
            <div style={{ fontWeight: 700, marginTop: 8, marginBottom: 4 }}>{f.label}</div>
            <div style={{ color: 'var(--c-subtle)', fontSize: 12 }}>{f.desc}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
