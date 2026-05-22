import React, { useState } from 'react'

const KEY  = 'ff_measurements'
const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || [] } catch { return [] } }
const save = (d) => localStorage.setItem(KEY, JSON.stringify(d))
const today = () => new Date().toISOString().slice(0, 10)

const FIELDS = [
  { key: 'waist',  label: 'Waist',       unit: 'cm', color: '#e879f9' },
  { key: 'chest',  label: 'Chest',       unit: 'cm', color: '#60a5fa' },
  { key: 'bicep',  label: 'Bicep (L)',   unit: 'cm', color: '#4ade80' },
  { key: 'hips',   label: 'Hips',        unit: 'cm', color: '#fb923c' },
  { key: 'thigh',  label: 'Thigh (L)',   unit: 'cm', color: '#f87171' },
]

const fmt = (d) => new Date(d + 'T00:00:00').toLocaleDateString('en-SG', { day: 'numeric', month: 'short', year: 'numeric' })

export default function Measurements() {
  const [entries, setEntries] = useState(load)
  const [date,    setDate]    = useState(today)
  const [inputs,  setInputs]  = useState({})
  const [error,   setError]   = useState('')

  const setField = (k, v) => setInputs(p => ({ ...p, [k]: v }))

  const add = () => {
    const vals = {}
    let hasAny = false
    for (const f of FIELDS) {
      const v = parseFloat(inputs[f.key])
      if (!isNaN(v) && v > 0) { vals[f.key] = v; hasAny = true }
    }
    if (!hasAny) { setError('Enter at least one measurement'); return }
    if (!date)   { setError('Pick a date'); return }

    const entry = { date, ...vals }
    const next  = [...entries, entry].sort((a, b) => a.date.localeCompare(b.date))
    setEntries(next); save(next)
    setInputs({}); setError('')
  }

  const remove = (i) => {
    const next = entries.filter((_, idx) => idx !== i)
    setEntries(next); save(next)
  }

  // Latest vs previous for each field
  const latest = entries[entries.length - 1]
  const prev   = entries[entries.length - 2]

  const diff = (key) => {
    if (!latest?.[key] || !prev?.[key]) return null
    return (latest[key] - prev[key]).toFixed(1)
  }

  return (
    <section>
      <h2>📏 Body Measurements</h2>

      {/* Stat summary */}
      {latest && (
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 12 }}>
          {FIELDS.filter(f => latest[f.key]).map(f => {
            const d = diff(f.key)
            return (
              <div key={f.key} className="card" style={{ flex: '1 1 90px', textAlign: 'center', padding: '12px 10px' }}>
                <div style={{ color: 'var(--c-subtle)', fontSize: 11, marginBottom: 4 }}>{f.label}</div>
                <div style={{ color: f.color, fontSize: 22, fontWeight: 700 }}>{latest[f.key]}</div>
                <div style={{ fontSize: 10, color: 'var(--c-subtle)', marginBottom: 2 }}>{f.unit}</div>
                {d !== null && (
                  <div style={{ fontSize: 11, color: parseFloat(d) < 0 ? '#4ade80' : parseFloat(d) > 0 ? '#fb923c' : '#888' }}>
                    {parseFloat(d) > 0 ? '+' : ''}{d}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Log form */}
      <div className="card" style={{ marginTop: 16 }}>
        <h3 style={{ marginTop: 0 }}>Log Measurements</h3>
        <div style={{ marginBottom: 12 }}>
          <div style={{ color: 'var(--c-muted)', fontSize: 13, marginBottom: 4 }}>Date</div>
          <input className="input" type="date" value={date} onChange={e => setDate(e.target.value)} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px,1fr))', gap: 10 }}>
          {FIELDS.map(f => (
            <div key={f.key}>
              <div style={{ color: 'var(--c-muted)', fontSize: 13, marginBottom: 4 }}>{f.label} (cm)</div>
              <input
                className="input" type="number" placeholder="e.g. 80" style={{ width: '100%' }}
                value={inputs[f.key] || ''}
                onChange={e => setField(f.key, e.target.value)}
              />
            </div>
          ))}
        </div>
        {error && <p style={{ color: '#f87171', fontSize: 13, marginTop: 8 }}>{error}</p>}
        <button
          onClick={add}
          style={{ marginTop: 14, background: '#e879f9', border: 'none', color: '#000', padding: '9px 22px', borderRadius: 8, fontWeight: 700, cursor: 'pointer', fontSize: 14 }}
        >
          + Log Measurements
        </button>
      </div>

      {/* History table */}
      {entries.length > 0 && (
        <div className="card" style={{ marginTop: 16, overflowX: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h3 style={{ margin: 0 }}>History ({entries.length})</h3>
            <button
              onClick={() => { if (window.confirm('Clear all measurements?')) { setEntries([]); save([]) } }}
              style={{ background: 'none', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--c-subtle)', padding: '4px 12px', borderRadius: 8, cursor: 'pointer', fontSize: 12 }}
            >
              Clear All
            </button>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                <th style={{ textAlign: 'left', padding: '4px 8px 8px 0', color: 'var(--c-subtle)' }}>Date</th>
                {FIELDS.map(f => (
                  <th key={f.key} style={{ textAlign: 'center', padding: '4px 8px 8px', color: f.color }}>{f.label}</th>
                ))}
                <th />
              </tr>
            </thead>
            <tbody>
              {[...entries].reverse().map((e, ri) => {
                const i = entries.length - 1 - ri
                return (
                  <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td style={{ padding: '8px 0', color: 'var(--c-muted)', fontSize: 12 }}>{fmt(e.date)}</td>
                    {FIELDS.map(f => (
                      <td key={f.key} style={{ textAlign: 'center', padding: '8px', color: e[f.key] ? f.color : 'var(--c-faint)', fontWeight: e[f.key] ? 600 : 400 }}>
                        {e[f.key] || '—'}
                      </td>
                    ))}
                    <td style={{ textAlign: 'center' }}>
                      <button onClick={() => remove(i)} style={{ background: 'none', border: 'none', color: 'var(--c-faint)', cursor: 'pointer', fontSize: 16 }}>×</button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {entries.length === 0 && (
        <div className="card" style={{ marginTop: 16, textAlign: 'center', padding: '40px 24px' }}>
          <div style={{ fontSize: 40, marginBottom: 10 }}>📏</div>
          <p style={{ color: 'var(--c-subtle)' }}>No measurements logged yet. Track waist, chest, arms and more over time.</p>
        </div>
      )}
    </section>
  )
}
