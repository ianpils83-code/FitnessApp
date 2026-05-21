import React, { useState } from 'react'

const PR_KEY = 'ff_prs'
const loadPRs = () => { try { return JSON.parse(localStorage.getItem(PR_KEY)) || {} } catch { return {} } }
const savePRs = (data) => localStorage.setItem(PR_KEY, JSON.stringify(data))

const isNewPR = (entry, current) => {
  if (!current) return true
  if (entry.weight !== null && current.weight !== null) {
    if (entry.weight > current.weight) return true
    if (entry.weight === current.weight && entry.reps > current.reps) return true
    return false
  }
  return entry.reps > current.reps
}

export default function ExerciseCard({ exercise }) {
  const [showForm, setShowForm] = useState(false)
  const [showTips, setShowTips] = useState(false)
  const [weight,   setWeight]   = useState('')
  const [reps,     setReps]     = useState('')
  const [flash,    setFlash]    = useState(null) // 'pr' | 'saved'

  const isBodyweight = exercise.equipment === 'Bodyweight'
  const prs  = loadPRs()
  const myPR = prs[exercise.name]?.current || null

  const handleSave = () => {
    const r = parseInt(reps)
    if (!reps || isNaN(r) || r < 1) return

    const w = isBodyweight ? null : (weight ? parseFloat(weight) : null)
    const entry = { weight: w, reps: r, date: new Date().toISOString().slice(0, 10) }

    const all = loadPRs()
    const existing = all[exercise.name] || { current: null, history: [] }
    const newPr = isNewPR(entry, existing.current)

    const updated = {
      current: newPr ? entry : existing.current,
      history: [entry, ...(existing.history || [])].slice(0, 10)
    }

    all[exercise.name] = updated
    savePRs(all)

    setFlash(newPr ? 'pr' : 'saved')
    setTimeout(() => setFlash(null), 2000)
    setShowForm(false)
    setWeight('')
    setReps('')
  }

  return (
    <article className="card exercise" style={{ position: 'relative' }}>
      {/* New PR flash banner */}
      {flash && (
        <div style={{
          position: 'absolute', top: 8, left: 8, right: 8, zIndex: 10,
          background: flash === 'pr' ? '#4ade80' : '#e879f9',
          color: '#000', borderRadius: 8, padding: '6px 10px',
          fontWeight: 700, fontSize: 13, textAlign: 'center',
          animation: 'fadeIn 0.2s ease'
        }}>
          {flash === 'pr' ? '🎉 New Personal Record!' : '✓ Logged'}
        </div>
      )}

      <img src={exercise.img} alt={exercise.name} style={{ borderRadius: 8, width: '100%', objectFit: 'cover' }} />

      <h3 style={{ marginTop: 10, marginBottom: 2 }}>{exercise.name}</h3>
      <div style={{ color: '#bbb', fontSize: 13 }}>{exercise.muscle} • {exercise.equipment}</div>

      {/* How To tips */}
      {exercise.tips?.length > 0 && (
        <div style={{ marginTop: 8 }}>
          <button
            onClick={() => setShowTips(s => !s)}
            style={{
              background: 'none', border: 'none', color: showTips ? '#e879f9' : '#555',
              cursor: 'pointer', fontSize: 12, padding: 0,
              display: 'flex', alignItems: 'center', gap: 4
            }}
          >
            <span>{showTips ? '▲' : '▼'}</span>
            <span>💡 {showTips ? 'Hide tips' : 'How to do it'}</span>
          </button>
          {showTips && (
            <ul style={{ margin: '8px 0 0', paddingLeft: 16, listStyle: 'none' }}>
              {exercise.tips.map((tip, i) => (
                <li key={i} style={{
                  fontSize: 12, color: '#bbb', marginBottom: 5,
                  paddingLeft: 12, position: 'relative', lineHeight: 1.5
                }}>
                  <span style={{ position: 'absolute', left: 0, color: '#e879f9' }}>›</span>
                  {tip}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Current PR badge */}
      {myPR && (
        <div style={{
          marginTop: 8, background: '#1a1a1a', border: '1px solid #333',
          borderRadius: 8, padding: '5px 10px', fontSize: 12
        }}>
          <span style={{ color: '#888' }}>🏅 Best: </span>
          <span style={{ color: '#e879f9', fontWeight: 700 }}>
            {myPR.weight ? `${myPR.weight}kg × ` : ''}{myPR.reps} reps
          </span>
          <span style={{ color: '#555', marginLeft: 6 }}>{myPR.date}</span>
        </div>
      )}

      {/* Log PR form */}
      {showForm ? (
        <div style={{ marginTop: 10 }}>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {!isBodyweight && (
              <input
                className="input"
                type="number"
                placeholder="kg"
                value={weight}
                onChange={e => setWeight(e.target.value)}
                style={{ width: 64, fontSize: 13 }}
              />
            )}
            <input
              className="input"
              type="number"
              placeholder="reps"
              value={reps}
              onChange={e => setReps(e.target.value)}
              style={{ width: 70, fontSize: 13 }}
              onKeyDown={e => e.key === 'Enter' && handleSave()}
            />
            <button
              onClick={handleSave}
              style={{
                background: '#e879f9', border: 'none', color: '#000',
                borderRadius: 8, padding: '0 12px', fontWeight: 700,
                cursor: 'pointer', fontSize: 13
              }}
            >Save</button>
            <button
              onClick={() => { setShowForm(false); setWeight(''); setReps('') }}
              style={{
                background: 'none', border: '1px solid #333', color: '#888',
                borderRadius: 8, padding: '0 10px', cursor: 'pointer', fontSize: 13
              }}
            >×</button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowForm(true)}
          style={{
            marginTop: 10, width: '100%', background: 'none',
            border: '1px solid #333', color: '#888', borderRadius: 8,
            padding: '6px 0', cursor: 'pointer', fontSize: 12,
            transition: 'border-color 0.2s, color 0.2s'
          }}
          onMouseEnter={e => { e.target.style.borderColor = '#e879f9'; e.target.style.color = '#e879f9' }}
          onMouseLeave={e => { e.target.style.borderColor = '#333';    e.target.style.color = '#888'    }}
        >
          🏅 {myPR ? 'Log New Attempt' : 'Log PR'}
        </button>
      )}
    </article>
  )
}
