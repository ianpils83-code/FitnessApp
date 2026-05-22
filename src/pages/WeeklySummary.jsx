import React from 'react'

const ls = (k, fb) => { try { const v = localStorage.getItem(k); return v !== null ? JSON.parse(v) : fb } catch { return fb } }

const today = () => new Date().toISOString().slice(0, 10)
const daysAgo = (n) => new Date(Date.now() - n * 86400000).toISOString().slice(0, 10)

// ── Compute all weekly stats ────────────────────────────────────
const getWeekStats = () => {
  const weekStart = daysAgo(6)
  const todayStr  = today()

  // Workout history
  const history  = ls('ff_history',  [])
  const thisWeek = history.filter(e => e.date >= weekStart && e.date <= todayStr)
  const lastWeek = history.filter(e => e.date >= daysAgo(13) && e.date < weekStart)
  const workoutDays = [...new Set(thisWeek.map(e => e.date))].length

  // Streak
  const allDates = [...new Set(history.map(e => e.date))].sort().reverse()
  let streak = 0
  if (allDates.length) {
    const yStr = daysAgo(1)
    if (allDates[0] === todayStr || allDates[0] === yStr) {
      let check = allDates[0]
      for (const d of allDates) {
        if (d === check) { streak++; check = new Date(new Date(check).getTime() - 86400000).toISOString().slice(0, 10) }
        else break
      }
    }
  }

  // Food log — avg daily calories this week
  const foodLog = ls('ff_food_log', {})
  const foodDays = Object.entries(foodLog).filter(([d]) => d >= weekStart && d <= todayStr)
  const totalKcal = foodDays.reduce((sum, [, items]) => sum + items.reduce((s, i) => s + (i.protein * 4 + i.carbs * 4 + i.fat * 9), 0), 0)
  const avgKcal = foodDays.length ? Math.round(totalKcal / foodDays.length) : null

  // Water avg this week
  const waterLog = ls('ff_water_log', {})
  const waterDays = Object.entries(waterLog).filter(([d]) => d >= weekStart && d <= todayStr)
  const waterGoal = parseInt(localStorage.getItem('ff_water_goal') || '8')
  const avgWater  = waterDays.length ? (waterDays.reduce((s, [, n]) => s + n, 0) / waterDays.length).toFixed(1) : null

  // Weight change
  const weightLog = ls('ff_progress', [])
  const weekWeights = weightLog.filter(e => e.date >= weekStart && e.date <= todayStr)
  const weightChange = weekWeights.length >= 2
    ? (weekWeights[weekWeights.length - 1].weight - weekWeights[0].weight).toFixed(1)
    : null

  // PRs this week (check date in prs)
  const prs = ls('ff_prs', {})
  const newPRs = Object.values(prs).filter(pr => {
    const best = pr.history?.[0]?.date || ''
    return best >= weekStart && best <= todayStr
  }).length

  // Calorie burn estimate
  const kcalBurned = thisWeek.reduce((sum, e) => {
    const weight = ls('ff_weight', 70)
    const ex = e.exerciseCount || 5
    return sum + Math.round((weight * 5.0 * ex * 9 / 60) / 10) * 10
  }, 0)

  // Plans used
  const plansUsed = [...new Set(thisWeek.map(e => e.planTitle))]

  return { thisWeek: thisWeek.length, lastWeek: lastWeek.length, workoutDays, streak, avgKcal, avgWater, waterGoal, weightChange, newPRs, kcalBurned, plansUsed }
}

// ── Mini stat card ──────────────────────────────────────────────
function StatCard({ emoji, label, value, sub, color = '#e879f9', trend }) {
  return (
    <div className="card" style={{ flex: '1 1 130px', padding: '14px 16px' }}>
      <div style={{ fontSize: 22, marginBottom: 6 }}>{emoji}</div>
      <div style={{ color: 'var(--c-subtle)', fontSize: 11, marginBottom: 4 }}>{label}</div>
      <div style={{ color, fontSize: 24, fontWeight: 800, lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ color: 'var(--c-subtle)', fontSize: 11, marginTop: 4 }}>{sub}</div>}
      {trend !== undefined && trend !== null && (
        <div style={{ fontSize: 11, marginTop: 4, color: parseFloat(trend) > 0 ? '#fb923c' : parseFloat(trend) < 0 ? '#4ade80' : '#888' }}>
          {parseFloat(trend) > 0 ? '▲' : parseFloat(trend) < 0 ? '▼' : '→'} {Math.abs(trend)} kg vs last week
        </div>
      )}
    </div>
  )
}

// ── Day dots ────────────────────────────────────────────────────
function DayDots({ history }) {
  const weekStart = daysAgo(6)
  const todayStr  = today()
  const workoutSet = new Set(history.filter(e => e.date >= weekStart).map(e => e.date))

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(Date.now() - (6 - i) * 86400000)
    const str = d.toISOString().slice(0, 10)
    const label = d.toLocaleDateString('en-SG', { weekday: 'short' }).slice(0, 2)
    return { str, label, trained: workoutSet.has(str), isToday: str === todayStr }
  })

  return (
    <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
      {days.map(d => (
        <div key={d.str} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
          <div style={{
            width: 36, height: 36, borderRadius: '50%',
            background: d.trained ? '#e879f9' : 'rgba(255,255,255,0.05)',
            border: d.isToday ? '2px solid #e879f9' : '2px solid transparent',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 16,
          }}>
            {d.trained ? '✓' : ''}
          </div>
          <div style={{ fontSize: 10, color: d.isToday ? '#e879f9' : 'var(--c-subtle)' }}>{d.label}</div>
        </div>
      ))}
    </div>
  )
}

export default function WeeklySummary() {
  const stats   = getWeekStats()
  const history = ls('ff_history', [])
  const goal    = ls('ff_goal', 'maintain')

  const weekLabel = (() => {
    const s = new Date(Date.now() - 6 * 86400000)
    const e = new Date()
    const fmt = d => d.toLocaleDateString('en-SG', { day: 'numeric', month: 'short' })
    return `${fmt(s)} – ${fmt(e)}`
  })()

  return (
    <section>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, marginBottom: 4 }}>
        <h2 style={{ margin: 0 }}>📆 Weekly Summary</h2>
        <div style={{ color: 'var(--c-subtle)', fontSize: 13 }}>{weekLabel}</div>
      </div>

      {/* Training week dots */}
      <div className="card" style={{ marginTop: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 16 }}>This Week's Training</div>
            <div style={{ color: 'var(--c-subtle)', fontSize: 13, marginTop: 2 }}>
              {stats.workoutDays} day{stats.workoutDays !== 1 ? 's' : ''} trained · {stats.thisWeek} session{stats.thisWeek !== 1 ? 's' : ''} logged
            </div>
          </div>
          {stats.streak > 0 && (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#fb923c' }}>{stats.streak}</div>
              <div style={{ fontSize: 11, color: 'var(--c-subtle)' }}>🔥 streak</div>
            </div>
          )}
        </div>
        <DayDots history={history} />
      </div>

      {/* Stat grid */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 16 }}>
        <StatCard emoji="🏋️" label="Workouts" value={stats.thisWeek}
          sub={stats.lastWeek > 0 ? `${stats.lastWeek} last week` : 'First week!'}
          color="#e879f9"
        />
        <StatCard emoji="🔥" label="Kcal Burned" value={stats.kcalBurned > 0 ? `~${stats.kcalBurned}` : '—'}
          sub="estimated" color="#fb923c"
        />
        <StatCard emoji="🍽️" label="Avg Daily Kcal" value={stats.avgKcal ?? '—'}
          sub={stats.avgKcal ? 'kcal/day' : 'Log food to track'} color="#60a5fa"
        />
        <StatCard emoji="💧" label="Avg Water" value={stats.avgWater ?? '—'}
          sub={stats.avgWater ? `of ${stats.waterGoal} goal` : 'Use Water tracker'} color="#60a5fa"
        />
        <StatCard emoji="⚖️" label="Weight Change"
          value={stats.weightChange !== null ? `${parseFloat(stats.weightChange) > 0 ? '+' : ''}${stats.weightChange} kg` : '—'}
          sub="this week" color={stats.weightChange !== null ? (parseFloat(stats.weightChange) < 0 && goal === 'lose') ? '#4ade80' : (parseFloat(stats.weightChange) > 0 && goal === 'gain') ? '#4ade80' : '#fb923c' : '#888'}
        />
        <StatCard emoji="🏅" label="New PRs" value={stats.newPRs || '—'}
          sub={stats.newPRs > 0 ? 'personal records!' : 'Hit a PR this week'} color="#4ade80"
        />
      </div>

      {/* Plans used */}
      {stats.plansUsed.length > 0 && (
        <div className="card" style={{ marginTop: 16 }}>
          <h3 style={{ marginTop: 0, marginBottom: 10 }}>Plans Trained</h3>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {stats.plansUsed.map(p => (
              <div key={p} style={{ background: 'rgba(232,121,249,0.1)', border: '1px solid rgba(232,121,249,0.2)', borderRadius: 20, padding: '5px 14px', fontSize: 13, color: '#e879f9', fontWeight: 600 }}>
                {p}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Motivational footer */}
      <div className="card" style={{ marginTop: 16, background: 'rgba(232,121,249,0.06)', border: '1px solid rgba(232,121,249,0.15)', textAlign: 'center', padding: '20px' }}>
        {stats.thisWeek === 0
          ? <p style={{ color: 'var(--c-muted)', margin: 0 }}>No workouts logged yet this week. Get started — even one session counts! 💪</p>
          : stats.workoutDays >= 5
          ? <p style={{ color: '#e879f9', margin: 0, fontWeight: 600 }}>🔥 Outstanding week — {stats.workoutDays} days trained. You're in the top tier.</p>
          : stats.workoutDays >= 3
          ? <p style={{ color: '#e879f9', margin: 0, fontWeight: 600 }}>⚡ Solid week — {stats.workoutDays} days down. Push for one more session!</p>
          : <p style={{ color: 'var(--c-muted)', margin: 0 }}>Good start — keep showing up and results will follow. 💪</p>
        }
      </div>
    </section>
  )
}
