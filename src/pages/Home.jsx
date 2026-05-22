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

// ── Progress Ring ──────────────────────────────────────────────
function Ring({ value, max, color, emoji, label, size = 80 }) {
  const R    = size * 0.38
  const CIRC = 2 * Math.PI * R
  const pct  = Math.min(value / Math.max(max, 1), 1)
  const off  = CIRC * (1 - pct)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          <circle cx={size/2} cy={size/2} r={R} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={size*0.1} />
          <circle cx={size/2} cy={size/2} r={R} fill="none" stroke={color} strokeWidth={size*0.1}
            strokeDasharray={CIRC} strokeDashoffset={off} strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.6s ease' }}
          />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: size * 0.3 }}>
          {emoji}
        </div>
      </div>
      <div style={{ fontSize: 11, color: 'var(--c-subtle)', textAlign: 'center', lineHeight: 1.3 }}>{label}</div>
    </div>
  )
}

// ── Activity Heatmap ───────────────────────────────────────────
function Heatmap({ history }) {
  const countByDate = {}
  for (const e of history) countByDate[e.date] = (countByDate[e.date] || 0) + 1
  const todayStr = today()
  const DAYS = 35

  const cells = Array.from({ length: DAYS }, (_, i) => {
    const d = daysAgo(DAYS - 1 - i)
    return { date: d, count: countByDate[d] || 0, isToday: d === todayStr }
  })

  const cellColor = (count) =>
    count === 0 ? 'rgba(255,255,255,0.05)' :
    count === 1 ? 'rgba(232,121,249,0.4)'  : '#e879f9'

  return (
    <div>
      <div style={{ display: 'flex', gap: 3, flexDirection: 'column' }}>
        {Array.from({ length: 5 }, (_, row) => (
          <div key={row} style={{ display: 'flex', gap: 3 }}>
            {Array.from({ length: 7 }, (_, col) => {
              const cell = cells[row * 7 + col]
              return (
                <div
                  key={col}
                  title={cell?.count ? `${cell.date} — ${cell.count} workout${cell.count > 1 ? 's' : ''}` : cell?.date}
                  style={{
                    width: 20, height: 20, borderRadius: 4,
                    background: cell ? cellColor(cell.count) : 'rgba(255,255,255,0.04)',
                    border: cell?.isToday ? '1.5px solid #e879f9' : '1.5px solid transparent',
                  }}
                />
              )
            })}
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 8 }}>
        <span style={{ fontSize: 10, color: 'var(--c-subtle)' }}>Less</span>
        {['rgba(255,255,255,0.05)','rgba(232,121,249,0.3)','#e879f9'].map((c,i) => (
          <div key={i} style={{ width: 12, height: 12, borderRadius: 3, background: c }} />
        ))}
        <span style={{ fontSize: 10, color: 'var(--c-subtle)' }}>More</span>
      </div>
    </div>
  )
}

export default function Home({ setPage }) {
  const history    = ls('ff_history',  [])
  const progress   = ls('ff_progress', [])
  const streak     = calcStreak(history)
  const total      = history.length
  const todayStr   = today()
  const trainedToday = history.some(e => e.date === todayStr)

  const name   = ls('ff_profile_name',  '')
  const avatar = ls('ff_profile_emoji', '💪')
  const hour   = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  // Calories
  const foodLog   = ls('ff_food_log', {})
  const todayFood = foodLog[todayStr] || []
  const kcalToday = Math.round(todayFood.reduce((s, i) => s + i.protein*4 + i.carbs*4 + i.fat*9, 0))
  const kcalTarget = (() => {
    const w=ls('ff_weight',75), h=ls('ff_height',175), a=ls('ff_age',30)
    const s=ls('ff_sex','male'), act=ls('ff_activity',1.55), g=ls('ff_goal','maintain')
    const bmr = s==='male' ? 10*w+6.25*h-5*a+5 : 10*w+6.25*h-5*a-161
    const m = Math.round(bmr*act)
    return g==='lose' ? m-500 : g==='gain' ? m+300 : m
  })()

  // Water
  const waterLog   = ls('ff_water_log', {})
  const waterToday = waterLog[todayStr] || 0
  const waterGoal  = parseInt(localStorage.getItem('ff_water_goal') || '8')

  const streakEmoji = streak >= 14 ? '🏆' : streak >= 7 ? '🔥' : streak >= 3 ? '⚡' : '✅'

  // Last weight
  const lastWeight = progress.length ? progress[progress.length - 1].weight : null

  return (
    <section>

      {/* ── Greeting + CTA ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, margin: 0 }}>
            {greeting}{name ? `, ${name}` : ''} {avatar}
          </h1>
          <p style={{ color: 'var(--c-muted)', fontSize: 13, marginTop: 4 }}>
            {trainedToday ? '🎉 Trained today — streak is alive!' : 'Ready to train? Let\'s go.'}
          </p>
        </div>
        <button
          onClick={() => setPage('plans')}
          style={{ background: 'linear-gradient(135deg,#ff6a00,#ff9a00)', border: 'none', color: '#fff', padding: '11px 22px', borderRadius: 10, fontWeight: 700, fontSize: 15, cursor: 'pointer', whiteSpace: 'nowrap' }}
        >
          🏋️ Start Training
        </button>
      </div>

      {/* ── Today + Heatmap side by side ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px,1fr))', gap: 12, marginBottom: 16 }}>

        {/* Today card */}
        <div className="card">
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 14, color: 'var(--c-muted)' }}>TODAY</div>
          <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'flex-start' }}>
            <Ring value={trainedToday?1:0} max={1} color={trainedToday?'#4ade80':'#e879f9'} emoji={trainedToday?'✅':'🏋️'} label={trainedToday ? 'Trained' : 'Not yet'} />
            <Ring value={kcalToday} max={kcalTarget} color="#fb923c" emoji="🍽️" label={`${kcalToday} / ${kcalTarget}`} />
            <Ring value={waterToday} max={waterGoal} color="#60a5fa" emoji="💧" label={`${waterToday} / ${waterGoal} cups`} />
          </div>
        </div>

        {/* Activity heatmap */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--c-muted)' }}>ACTIVITY</div>
            {streak > 0 && (
              <div style={{ fontSize: 13, fontWeight: 700, color: '#fb923c' }}>
                {streakEmoji} {streak}-day streak
              </div>
            )}
          </div>
          <Heatmap history={history} />
        </div>
      </div>

      {/* ── Quick actions — only 4, prominent ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px,1fr))', gap: 10, marginBottom: 16 }}>
        {[
          { emoji: '📋', label: 'My Plans',   page: 'plans',    color: '#e879f9', desc: 'Start a session' },
          { emoji: '🍽️', label: 'Log Meal',   page: 'macros',   color: '#fb923c', desc: 'Track macros' },
          { emoji: '💧', label: 'Water',      page: 'water',    color: '#60a5fa', desc: `${waterToday}/${waterGoal} today` },
          { emoji: '📆', label: 'This Week',  page: 'weekly',   color: '#a78bfa', desc: 'Weekly recap' },
        ].map(a => (
          <button
            key={a.label}
            onClick={() => setPage(a.page)}
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '16px 12px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, transition: 'background 0.2s, border-color 0.2s, transform 0.15s', color: 'var(--c-text)', textAlign: 'center' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = a.color+'55'; e.currentTarget.style.background = a.color+'12'; e.currentTarget.style.transform = 'translateY(-2px)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.transform = 'translateY(0)' }}
          >
            <span style={{ fontSize: 26 }}>{a.emoji}</span>
            <span style={{ fontSize: 13, fontWeight: 700 }}>{a.label}</span>
            <span style={{ fontSize: 11, color: 'var(--c-subtle)' }}>{a.desc}</span>
          </button>
        ))}
      </div>

      {/* ── Single summary strip ── */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {[
          { label: 'Total Workouts', value: total,                                    color: '#e879f9', page: 'history'    },
          { label: 'PRs Tracked',    value: Object.keys(ls('ff_prs',{})).length,      color: '#4ade80', page: 'records'    },
          { label: 'Weight',         value: lastWeight ? `${lastWeight} kg` : '—',    color: '#60a5fa', page: 'progress'   },
          { label: 'Badges',         value: `${ls('ff_profile_name','') ? '👤' : '+'} Profile`, color: '#fb923c', page: 'profile' },
        ].map(s => (
          <div
            key={s.label}
            onClick={() => setPage(s.page)}
            style={{ flex: '1 1 90px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: '12px 10px', textAlign: 'center', cursor: 'pointer', transition: 'border-color 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.borderColor = s.color+'44'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'}
          >
            <div style={{ color: 'var(--c-subtle)', fontSize: 10, marginBottom: 4 }}>{s.label}</div>
            <div style={{ color: s.color, fontSize: 20, fontWeight: 800 }}>{s.value}</div>
          </div>
        ))}
      </div>

    </section>
  )
}
