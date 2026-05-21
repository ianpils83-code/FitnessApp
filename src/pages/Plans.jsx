import React, { useState } from 'react'

const plans = [
  {
    id: 1,
    title: 'Fat Loss Starter',
    tag: '4 Weeks · 3x / Week',
    emoji: '🔥',
    desc: 'Short, intense circuits to burn calories and build conditioning.',
    goal: 'Lose Fat',
    level: 'Beginner',
    weeks: [
      {
        week: 1,
        days: [
          {
            day: 'Day 1 — Full Body Circuit',
            exercises: [
              { name: 'Push-up',          sets: 3, reps: '12',    rest: '30s' },
              { name: 'Squat',            sets: 3, reps: '15',    rest: '30s' },
              { name: 'Mountain Climber', sets: 3, reps: '30s',   rest: '30s' },
              { name: 'Plank',            sets: 3, reps: '30s',   rest: '30s' },
              { name: 'Lunge',            sets: 3, reps: '10 each', rest: '30s' },
            ]
          },
          {
            day: 'Day 2 — Cardio + Core',
            exercises: [
              { name: 'Burpee',           sets: 3, reps: '10',    rest: '45s' },
              { name: 'Russian Twist',    sets: 3, reps: '20',    rest: '30s' },
              { name: 'Bicycle Crunch',   sets: 3, reps: '20',    rest: '30s' },
              { name: 'Leg Raise',        sets: 3, reps: '12',    rest: '30s' },
              { name: 'Side Plank',       sets: 2, reps: '30s each', rest: '30s' },
            ]
          },
          {
            day: 'Day 3 — Full Body Burnout',
            exercises: [
              { name: 'Squat',            sets: 4, reps: '15',    rest: '30s' },
              { name: 'Push-up',          sets: 4, reps: '10',    rest: '30s' },
              { name: 'Mountain Climber', sets: 3, reps: '40s',   rest: '30s' },
              { name: 'Lunge',            sets: 3, reps: '12 each', rest: '30s' },
              { name: 'Plank',            sets: 3, reps: '45s',   rest: '30s' },
            ]
          }
        ]
      },
      {
        week: '2–4',
        days: [
          { day: 'Progressive Overload', exercises: [
            { name: 'Same structure', sets: '', reps: 'Add 1–2 reps or 1 set each week', rest: '' }
          ]}
        ]
      }
    ]
  },
  {
    id: 2,
    title: 'Muscle Builder',
    tag: '8 Weeks · 4x / Week',
    emoji: '💪',
    desc: 'Evidence-based hypertrophy split focused on progressive overload.',
    goal: 'Build Muscle',
    level: 'Intermediate',
    weeks: [
      {
        week: '1–4 (Volume Phase)',
        days: [
          {
            day: 'Day 1 — Upper Body',
            exercises: [
              { name: 'Bench Press',      sets: 4, reps: '8–10',  rest: '90s' },
              { name: 'Bent-over Row',    sets: 4, reps: '8–10',  rest: '90s' },
              { name: 'Shoulder Press',   sets: 3, reps: '10–12', rest: '60s' },
              { name: 'Bicep Curl',       sets: 3, reps: '12',    rest: '60s' },
              { name: 'Tricep Dip',       sets: 3, reps: '12',    rest: '60s' },
            ]
          },
          {
            day: 'Day 2 — Lower Body',
            exercises: [
              { name: 'Squat',            sets: 4, reps: '8–10',  rest: '2min' },
              { name: 'Deadlift',         sets: 3, reps: '6–8',   rest: '2min' },
              { name: 'Lunge',            sets: 3, reps: '10 each', rest: '60s' },
              { name: 'Glute Bridge',     sets: 3, reps: '15',    rest: '60s' },
              { name: 'Calf Raise',       sets: 4, reps: '15',    rest: '45s' },
            ]
          },
          {
            day: 'Day 3 — Upper Body (repeat)',
            exercises: [
              { name: 'Pull-up',          sets: 4, reps: '6–8',   rest: '90s' },
              { name: 'Chest Fly',        sets: 3, reps: '12',    rest: '60s' },
              { name: 'Arnold Press',     sets: 3, reps: '10',    rest: '60s' },
              { name: 'Hammer Curl',      sets: 3, reps: '12',    rest: '60s' },
              { name: 'Lateral Raise',    sets: 3, reps: '15',    rest: '45s' },
            ]
          },
          {
            day: 'Day 4 — Lower Body (repeat)',
            exercises: [
              { name: 'Squat',            sets: 4, reps: '10',    rest: '90s' },
              { name: 'Step-up',          sets: 3, reps: '10 each', rest: '60s' },
              { name: 'Glute Bridge',     sets: 4, reps: '15',    rest: '60s' },
              { name: 'Calf Raise',       sets: 4, reps: '20',    rest: '45s' },
              { name: 'Plank',            sets: 3, reps: '45s',   rest: '30s' },
            ]
          }
        ]
      },
      {
        week: '5–8 (Intensity Phase)',
        days: [
          { day: 'Progressive Overload', exercises: [
            { name: 'Same structure', sets: '', reps: 'Increase weight by 5% or add 1 set per exercise', rest: '' }
          ]}
        ]
      }
    ]
  },
  {
    id: 3,
    title: 'Beginner Strength',
    tag: '6 Weeks · 3x / Week',
    emoji: '🏋️',
    desc: 'Simple compound lifts and clear progressions for first-time gym-goers.',
    goal: 'Build Strength',
    level: 'Beginner',
    weeks: [
      {
        week: '1–2 (Learn the Movements)',
        days: [
          {
            day: 'Day A — Full Body',
            exercises: [
              { name: 'Squat',            sets: 3, reps: '5',     rest: '2min' },
              { name: 'Bench Press',      sets: 3, reps: '5',     rest: '2min' },
              { name: 'Bent-over Row',    sets: 3, reps: '5',     rest: '2min' },
              { name: 'Plank',            sets: 3, reps: '20s',   rest: '60s' },
            ]
          },
          {
            day: 'Day B — Full Body',
            exercises: [
              { name: 'Squat',            sets: 3, reps: '5',     rest: '2min' },
              { name: 'Shoulder Press',   sets: 3, reps: '5',     rest: '2min' },
              { name: 'Deadlift',         sets: 1, reps: '5',     rest: '3min' },
              { name: 'Plank',            sets: 3, reps: '20s',   rest: '60s' },
            ]
          }
        ]
      },
      {
        week: '3–6 (Add Weight)',
        days: [
          { day: 'Progressive Overload', exercises: [
            { name: 'Same A/B alternation', sets: '', reps: 'Add 2.5kg per session when all reps are completed cleanly', rest: '' }
          ]}
        ]
      }
    ]
  }
]

const tagColor = { Beginner: '#4ade80', Intermediate: '#fb923c', Advanced: '#f87171' }

export default function Plans() {
  const [selected, setSelected] = useState(null)
  const [openWeek, setOpenWeek] = useState(0)

  if (selected) {
    const plan = plans.find(p => p.id === selected)
    return (
      <section>
        {/* Back button */}
        <button
          onClick={() => { setSelected(null); setOpenWeek(0) }}
          style={{
            background: 'none', border: '1px solid #444', color: '#ccc',
            padding: '6px 14px', borderRadius: 8, cursor: 'pointer',
            marginBottom: 16, fontSize: 14
          }}
        >
          ← Back to Plans
        </button>

        {/* Plan Header */}
        <div className="card" style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 36 }}>{plan.emoji}</span>
            <div>
              <h2 style={{ margin: 0 }}>{plan.title}</h2>
              <div style={{ color: '#bbb', marginTop: 4 }}>{plan.tag}</div>
            </div>
            <span style={{
              marginLeft: 'auto',
              background: tagColor[plan.level] + '22',
              color: tagColor[plan.level],
              padding: '4px 14px', borderRadius: 20, fontWeight: 600, fontSize: 14
            }}>
              {plan.level}
            </span>
          </div>
          <p style={{ color: '#ccc', marginTop: 10 }}>{plan.desc}</p>
          <div style={{ display: 'flex', gap: 20, marginTop: 8 }}>
            <span style={{ color: '#888', fontSize: 13 }}>🎯 Goal: <strong style={{ color: '#fff' }}>{plan.goal}</strong></span>
          </div>
        </div>

        {/* Week Accordion */}
        {plan.weeks.map((w, wi) => (
          <div key={wi} style={{ marginBottom: 12 }}>
            <button
              onClick={() => setOpenWeek(openWeek === wi ? -1 : wi)}
              style={{
                width: '100%', textAlign: 'left', background: '#1e1e1e',
                border: '1px solid #333', color: '#fff', padding: '12px 16px',
                borderRadius: 10, cursor: 'pointer', fontWeight: 600, fontSize: 15,
                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
              }}
            >
              <span>📅 Week {w.week}</span>
              <span style={{ color: '#888' }}>{openWeek === wi ? '▲' : '▼'}</span>
            </button>

            {openWeek === wi && (
              <div style={{ border: '1px solid #333', borderTop: 'none', borderRadius: '0 0 10px 10px', padding: 16 }}>
                {w.days.map((d, di) => (
                  <div key={di} style={{ marginBottom: di < w.days.length - 1 ? 20 : 0 }}>
                    <h4 style={{ color: '#e879f9', marginBottom: 10 }}>{d.day}</h4>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                      <thead>
                        <tr style={{ color: '#888', borderBottom: '1px solid #333' }}>
                          <th style={{ textAlign: 'left', paddingBottom: 6 }}>Exercise</th>
                          <th style={{ textAlign: 'center', paddingBottom: 6 }}>Sets</th>
                          <th style={{ textAlign: 'center', paddingBottom: 6 }}>Reps</th>
                          <th style={{ textAlign: 'center', paddingBottom: 6 }}>Rest</th>
                        </tr>
                      </thead>
                      <tbody>
                        {d.exercises.map((ex, ei) => (
                          <tr key={ei} style={{ borderBottom: '1px solid #222' }}>
                            <td style={{ padding: '8px 0', color: '#fff' }}>{ex.name}</td>
                            <td style={{ textAlign: 'center', color: '#bbb' }}>{ex.sets}</td>
                            <td style={{ textAlign: 'center', color: '#bbb' }}>{ex.reps}</td>
                            <td style={{ textAlign: 'center', color: '#bbb' }}>{ex.rest}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </section>
    )
  }

  // Plan list
  return (
    <section>
      <h2>Workout Plans</h2>
      <p style={{ color: '#ccc' }}>Choose a plan and follow the week-by-week schedule.</p>
      <div className="grid" style={{ marginTop: 12 }}>
        {plans.map(p => (
          <div
            key={p.id}
            className="card"
            onClick={() => { setSelected(p.id); setOpenWeek(0) }}
            style={{ cursor: 'pointer', transition: 'border-color 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.borderColor = '#e879f9'}
            onMouseLeave={e => e.currentTarget.style.borderColor = ''}
          >
            <div style={{ fontSize: 28, marginBottom: 8 }}>{p.emoji}</div>
            <h3 style={{ margin: 0 }}>{p.title}</h3>
            <div style={{ color: '#888', fontSize: 13, margin: '4px 0 8px' }}>{p.tag}</div>
            <p style={{ color: '#ccc', margin: 0 }}>{p.desc}</p>
            <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{
                background: tagColor[p.level] + '22',
                color: tagColor[p.level],
                padding: '3px 12px', borderRadius: 20, fontSize: 13, fontWeight: 600
              }}>
                {p.level}
              </span>
              <span style={{ color: '#e879f9', fontSize: 13 }}>View Plan →</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
