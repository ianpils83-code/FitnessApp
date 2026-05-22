import React, { useState } from 'react'

const ls    = (k, fb) => { try { const v = localStorage.getItem(k); return v !== null ? JSON.parse(v) : fb } catch { return fb } }
const lsSet = (k, v)  => localStorage.setItem(k, JSON.stringify(v))
const today = ()      => new Date().toISOString().slice(0, 10)

const AVATARS = ['💪','🏋️','⚡','🔥','🦾','🏃','🧠','🎯','🏆','🐉','🚀','🌟','🦁','🐺','🏅','👊','🎽','🥇','💥','🛡️']

// ── Badge definitions ──────────────────────────────────────────
const getBadges = () => {
  const history  = ls('ff_history',  [])
  const prs      = ls('ff_prs',      {})
  const progress = ls('ff_progress', [])
  const foodLog  = ls('ff_food_log', {})

  const totalWorkouts = history.length
  const prCount       = Object.keys(prs).length
  const weightDays    = progress.length
  const foodDays      = Object.keys(foodLog).length

  // streak
  const dates = [...new Set(history.map(e => e.date))].sort().reverse()
  let streak = 0
  if (dates.length) {
    const todayStr = today()
    const yday = new Date(Date.now() - 86400000).toISOString().slice(0, 10)
    if (dates[0] === todayStr || dates[0] === yday) {
      let check = dates[0]
      for (const d of dates) {
        if (d === check) { streak++; check = new Date(new Date(check).getTime() - 86400000).toISOString().slice(0, 10) }
        else break
      }
    }
  }

  return [
    { id: 'first_workout', emoji: '🏋️', title: 'First Rep',      desc: 'Log your first workout',         unlocked: totalWorkouts >= 1  },
    { id: 'workouts10',    emoji: '📅', title: 'Consistent',      desc: 'Complete 10 workouts',            unlocked: totalWorkouts >= 10 },
    { id: 'workouts25',    emoji: '🦁', title: 'Dedicated',       desc: 'Complete 25 workouts',            unlocked: totalWorkouts >= 25 },
    { id: 'workouts50',    emoji: '🐉', title: 'Legend',          desc: 'Complete 50 workouts',            unlocked: totalWorkouts >= 50 },
    { id: 'streak3',       emoji: '🔥', title: 'On Fire',         desc: '3-day streak',                    unlocked: streak >= 3         },
    { id: 'streak7',       emoji: '⚡', title: 'Week Warrior',    desc: '7-day streak',                    unlocked: streak >= 7         },
    { id: 'streak14',      emoji: '🏆', title: 'Iron Will',       desc: '14-day streak',                   unlocked: streak >= 14        },
    { id: 'streak30',      emoji: '👑', title: 'Unstoppable',     desc: '30-day streak',                   unlocked: streak >= 30        },
    { id: 'first_pr',      emoji: '💪', title: 'PR Machine',      desc: 'Log your first PR',               unlocked: prCount >= 1        },
    { id: 'pr5',           emoji: '🎯', title: 'Elite Lifter',    desc: 'Track PRs for 5 exercises',       unlocked: prCount >= 5        },
    { id: 'pr10',          emoji: '🦾', title: 'Strength God',    desc: 'Track PRs for 10 exercises',      unlocked: prCount >= 10       },
    { id: 'tracker',       emoji: '📊', title: 'Scale Master',    desc: 'Log 10 weight entries',           unlocked: weightDays >= 10    },
    { id: 'nutrition',     emoji: '🍽️', title: 'Nutrition Nerd',  desc: 'Log food on 7 different days',    unlocked: foodDays >= 7       },
    { id: 'nutrition30',   emoji: '🥗', title: 'Clean Eater',     desc: 'Log food on 30 different days',   unlocked: foodDays >= 30      },
  ]
}

// ── Main component ─────────────────────────────────────────────
export default function Profile() {
  const [name,       setName]       = useState(() => ls('ff_profile_name',  ''))
  const [avatar,     setAvatar]     = useState(() => ls('ff_profile_emoji', '💪'))
  const [pickingAvatar, setPickingAvatar] = useState(false)

  // First-time join date
  const joined = (() => {
    const stored = ls('ff_profile_joined', null)
    if (stored) return stored
    const d = today()
    lsSet('ff_profile_joined', d)
    return d
  })()

  const saveName   = v => { setName(v);   lsSet('ff_profile_name',  v) }
  const saveAvatar = v => { setAvatar(v); lsSet('ff_profile_emoji', v); setPickingAvatar(false) }

  // Stats from localStorage
  const history  = ls('ff_history',  [])
  const prs      = ls('ff_prs',      {})
  const progress = ls('ff_progress', [])
  const dates    = [...new Set(history.map(e => e.date))]

  const badges   = getBadges()
  const unlocked = badges.filter(b => b.unlocked).length

  const joinedDate = new Date(joined + 'T00:00:00').toLocaleDateString('en-SG', { day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <section>
      <h2>👤 Profile</h2>

      {/* Profile Card */}
      <div className="card" style={{ marginTop: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>

          {/* Avatar */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setPickingAvatar(p => !p)}
              style={{
                width: 80, height: 80, borderRadius: '50%',
                background: '#1a1a1a', border: '2px solid #e879f9',
                fontSize: 40, cursor: 'pointer', display: 'flex',
                alignItems: 'center', justifyContent: 'center'
              }}
              title="Change avatar"
            >{avatar}</button>
            <div style={{ position: 'absolute', bottom: 0, right: 0, background: '#e879f9', borderRadius: '50%', width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, pointerEvents: 'none' }}>✏️</div>
          </div>

          {/* Name + joined */}
          <div style={{ flex: 1 }}>
            <input
              className="input"
              placeholder="Enter your name…"
              value={name}
              onChange={e => saveName(e.target.value)}
              style={{ fontSize: 20, fontWeight: 700, width: '100%', maxWidth: 280 }}
            />
            <div style={{ color: '#555', fontSize: 13, marginTop: 6 }}>Member since {joinedDate}</div>
          </div>

          {/* Badge count */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: '#e879f9' }}>{unlocked}<span style={{ color: '#444', fontSize: 16 }}>/{badges.length}</span></div>
            <div style={{ color: '#666', fontSize: 12 }}>Badges</div>
          </div>
        </div>

        {/* Avatar Picker */}
        {pickingAvatar && (
          <div style={{ marginTop: 16, padding: 12, background: '#111', borderRadius: 10, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {AVATARS.map(a => (
              <button
                key={a}
                onClick={() => saveAvatar(a)}
                style={{
                  width: 44, height: 44, borderRadius: 8, fontSize: 24, cursor: 'pointer',
                  background: avatar === a ? '#e879f922' : 'transparent',
                  border: avatar === a ? '2px solid #e879f9' : '2px solid transparent'
                }}
              >{a}</button>
            ))}
          </div>
        )}
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: 12, marginTop: 16, flexWrap: 'wrap' }}>
        {[
          { label: 'Workouts',     value: history.length,                  color: '#e879f9' },
          { label: 'Days Trained', value: dates.length,                    color: '#4ade80' },
          { label: 'PRs Tracked',  value: Object.keys(prs).length,         color: '#fb923c' },
          { label: 'Weight Logs',  value: progress.length,                 color: '#60a5fa' },
        ].map(s => (
          <div key={s.label} className="card" style={{ flex: '1 1 90px', textAlign: 'center', padding: '12px 8px' }}>
            <div style={{ color: '#666', fontSize: 11, marginBottom: 4 }}>{s.label}</div>
            <div style={{ color: s.color, fontSize: 24, fontWeight: 700 }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Achievements */}
      <div className="card" style={{ marginTop: 16 }}>
        <h3 style={{ marginTop: 0 }}>🏅 Achievements</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 10 }}>
          {badges.map(b => (
            <div
              key={b.id}
              style={{
                background: b.unlocked ? '#e879f910' : '#ffffff05',
                border: `1px solid ${b.unlocked ? '#e879f944' : '#222'}`,
                borderRadius: 10, padding: '12px 10px', textAlign: 'center',
                opacity: b.unlocked ? 1 : 0.45,
                transition: 'opacity 0.2s'
              }}
            >
              <div style={{ fontSize: 30, marginBottom: 6 }}>{b.unlocked ? b.emoji : '🔒'}</div>
              <div style={{ fontWeight: 700, fontSize: 13, color: b.unlocked ? '#fff' : '#555' }}>{b.title}</div>
              <div style={{ fontSize: 11, color: '#555', marginTop: 3 }}>{b.desc}</div>
              {b.unlocked && (
                <div style={{ marginTop: 6, fontSize: 10, color: '#e879f9', fontWeight: 600 }}>UNLOCKED</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
