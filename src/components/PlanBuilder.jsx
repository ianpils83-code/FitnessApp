import React, { useState } from 'react'
import allExercises from '../data/exercises.json'

const EMOJIS = ['⚡','🔥','💪','🎯','🌟','🏅','🦾','🧠','🚀','🐉']

export default function PlanBuilder({ onSave, onCancel, editPlan }) {
  const [name,      setName]      = useState(editPlan?.title     || '')
  const [emoji,     setEmoji]     = useState(editPlan?.emoji     || '⚡')
  const [exercises, setExercises] = useState(editPlan?.exercises || [])
  const [search,    setSearch]    = useState('')
  const [error,     setError]     = useState('')

  const filtered = allExercises.filter(e =>
    e.name.toLowerCase().includes(search.toLowerCase())
  )

  const addExercise = (ex) => {
    if (exercises.find(e => e.name === ex.name)) return
    setExercises(prev => [...prev, { name: ex.name, sets: 3, reps: '10', rest: '60s' }])
    setSearch('')
  }

  const removeExercise = (i) =>
    setExercises(prev => prev.filter((_, idx) => idx !== i))

  const updateExercise = (i, field, value) =>
    setExercises(prev => prev.map((e, idx) => idx === i ? { ...e, [field]: value } : e))

  const moveUp   = (i) => { if (i === 0) return; const a = [...exercises]; [a[i-1],a[i]] = [a[i],a[i-1]]; setExercises(a) }
  const moveDown = (i) => { if (i === exercises.length-1) return; const a = [...exercises]; [a[i],a[i+1]] = [a[i+1],a[i]]; setExercises(a) }

  const handleSave = () => {
    if (!name.trim())        { setError('Give your plan a name'); return }
    if (!exercises.length)   { setError('Add at least one exercise'); return }
    onSave({
      id:         editPlan?.id || `cp-${Date.now()}`,
      title:      name.trim(),
      emoji,
      isCustom:   true,
      desc:       `Custom plan · ${exercises.length} exercises`,
      exercises
    })
  }

  return (
    <section>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <button
          onClick={onCancel}
          style={{ background: 'none', border: '1px solid #444', color: '#ccc', padding: '6px 14px', borderRadius: 8, cursor: 'pointer', fontSize: 14 }}
        >
          ← Cancel
        </button>
        <h2 style={{ margin: 0 }}>{editPlan ? 'Edit Plan' : 'Build Custom Plan'}</h2>
      </div>

      {/* Plan name + emoji */}
      <div className="card" style={{ marginBottom: 16 }}>
        <h3 style={{ marginTop: 0, fontSize: 14, color: '#bbb' }}>Plan Name</h3>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <input
            className="input"
            placeholder="e.g. My Push Day"
            value={name}
            onChange={e => setName(e.target.value)}
            style={{ flex: 1, minWidth: 180 }}
          />
        </div>
        <h3 style={{ fontSize: 14, color: '#bbb', marginTop: 14, marginBottom: 8 }}>Pick an Icon</h3>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {EMOJIS.map(e => (
            <button
              key={e}
              onClick={() => setEmoji(e)}
              style={{
                fontSize: 22, background: emoji === e ? '#e879f922' : '#1a1a1a',
                border: `1px solid ${emoji === e ? '#e879f9' : '#2a2a2a'}`,
                borderRadius: 8, width: 42, height: 42, cursor: 'pointer'
              }}
            >{e}</button>
          ))}
        </div>
      </div>

      {/* Exercise picker */}
      <div className="card" style={{ marginBottom: 16 }}>
        <h3 style={{ marginTop: 0, fontSize: 14, color: '#bbb' }}>Add Exercises</h3>
        <input
          className="input"
          placeholder="Search exercises..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ width: '100%', marginBottom: 10 }}
        />
        {search && (
          <div style={{ maxHeight: 220, overflowY: 'auto', border: '1px solid #222', borderRadius: 8 }}>
            {filtered.length === 0 && (
              <div style={{ padding: '12px 16px', color: '#555', fontSize: 13 }}>No exercises found</div>
            )}
            {filtered.map(ex => {
              const added = !!exercises.find(e => e.name === ex.name)
              return (
                <div
                  key={ex.id}
                  onClick={() => !added && addExercise(ex)}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '10px 14px', borderBottom: '1px solid #1a1a1a',
                    cursor: added ? 'default' : 'pointer', opacity: added ? 0.4 : 1,
                    background: added ? '#111' : 'transparent'
                  }}
                >
                  <div>
                    <div style={{ fontSize: 14, color: '#fff' }}>{ex.name}</div>
                    <div style={{ fontSize: 11, color: '#555' }}>{ex.muscle} · {ex.equipment}</div>
                  </div>
                  <span style={{ fontSize: 12, color: added ? '#555' : '#4ade80' }}>
                    {added ? 'Added ✓' : '+ Add'}
                  </span>
                </div>
              )
            })}
          </div>
        )}
        {!search && (
          <p style={{ color: '#444', fontSize: 12, margin: 0 }}>
            Type above to search from {allExercises.length} exercises
          </p>
        )}
      </div>

      {/* Exercise list with config */}
      {exercises.length > 0 && (
        <div className="card" style={{ marginBottom: 16 }}>
          <h3 style={{ marginTop: 0, fontSize: 14, color: '#bbb' }}>
            Your Plan · {exercises.length} exercise{exercises.length !== 1 ? 's' : ''}
          </h3>
          {exercises.map((ex, i) => (
            <div
              key={i}
              style={{
                borderBottom: i < exercises.length - 1 ? '1px solid #1a1a1a' : 'none',
                paddingBottom: 14, marginBottom: 14
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{ex.name}</div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button onClick={() => moveUp(i)}   style={iconBtn} title="Move up">↑</button>
                  <button onClick={() => moveDown(i)} style={iconBtn} title="Move down">↓</button>
                  <button onClick={() => removeExercise(i)} style={{ ...iconBtn, color: '#f87171' }} title="Remove">×</button>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <div>
                  <div style={{ color: '#555', fontSize: 11, marginBottom: 3 }}>Sets</div>
                  <input
                    className="input" type="number" value={ex.sets} min="1" max="10"
                    onChange={e => updateExercise(i, 'sets', +e.target.value)}
                    style={{ width: 60, fontSize: 13 }}
                  />
                </div>
                <div>
                  <div style={{ color: '#555', fontSize: 11, marginBottom: 3 }}>Reps</div>
                  <input
                    className="input" value={ex.reps} placeholder="10"
                    onChange={e => updateExercise(i, 'reps', e.target.value)}
                    style={{ width: 80, fontSize: 13 }}
                  />
                </div>
                <div>
                  <div style={{ color: '#555', fontSize: 11, marginBottom: 3 }}>Rest</div>
                  <input
                    className="input" value={ex.rest} placeholder="60s"
                    onChange={e => updateExercise(i, 'rest', e.target.value)}
                    style={{ width: 80, fontSize: 13 }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {error && <p style={{ color: '#f87171', fontSize: 13, marginBottom: 12 }}>{error}</p>}

      {/* Save button */}
      <button
        onClick={handleSave}
        style={{
          width: '100%', padding: '13px 0', borderRadius: 10, border: 'none',
          background: '#e879f9', color: '#000', fontWeight: 700, fontSize: 16, cursor: 'pointer'
        }}
      >
        {editPlan ? '💾 Save Changes' : '✅ Create Plan'}
      </button>
    </section>
  )
}

const iconBtn = {
  background: 'none', border: '1px solid #2a2a2a', color: '#888',
  width: 28, height: 28, borderRadius: 6, cursor: 'pointer', fontSize: 14,
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center'
}
