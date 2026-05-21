import React, { useState } from 'react'

// ── Read calculator targets from localStorage ──────────────────
const lsGet = (k, fb) => { try { const v = localStorage.getItem(k); return v !== null ? JSON.parse(v) : fb } catch { return fb } }

const getTargets = () => {
  const sex      = lsGet('ff_sex',      'male')
  const age      = lsGet('ff_age',      30)
  const weight   = lsGet('ff_weight',   75)
  const height   = lsGet('ff_height',   175)
  const activity = lsGet('ff_activity', 1.2)
  const goal     = lsGet('ff_goal',     'maintain')

  const bmr  = sex === 'male'
    ? 10 * weight + 6.25 * height - 5 * age + 5
    : 10 * weight + 6.25 * height - 5 * age - 161

  const maint  = Math.round(bmr * activity)
  const kcal   = goal === 'lose' ? maint - 500 : goal === 'gain' ? maint + 300 : maint
  const protein = Math.round(weight * (goal === 'gain' ? 2.0 : 1.6))
  const fat     = Math.round((kcal * 0.25) / 9)
  const carbs   = Math.round((kcal - (protein * 4 + fat * 9)) / 4)
  return { kcal, protein, fat, carbs, goal, weight }
}

// ── Food log localStorage ──────────────────────────────────────
const LOG_KEY  = 'ff_food_log'
const loadLog  = () => { try { return JSON.parse(localStorage.getItem(LOG_KEY)) || {} } catch { return {} } }
const saveLog  = (l) => localStorage.setItem(LOG_KEY, JSON.stringify(l))
const todayStr = (offset = 0) => new Date(Date.now() + offset * 86400000).toISOString().slice(0, 10)
const fmtDate  = (d) => new Date(d + 'T00:00:00').toLocaleDateString('en-SG', { weekday: 'short', day: 'numeric', month: 'short' })

// ── Quick-add presets ──────────────────────────────────────────
const PRESETS = [
  { name: 'Chicken Rice',       protein: 35, carbs: 55, fat: 15 },
  { name: 'Nasi Lemak',         protein: 18, carbs: 65, fat: 28 },
  { name: 'Laksa (bowl)',        protein: 22, carbs: 52, fat: 26 },
  { name: 'Kaya Toast (set)',    protein:  8, carbs: 42, fat: 14 },
  { name: 'Mee Goreng',         protein: 14, carbs: 68, fat: 18 },
  { name: 'Char Kway Teow',     protein: 16, carbs: 58, fat: 22 },
  { name: 'Chicken Breast 100g',protein: 31, carbs:  0, fat:  4 },
  { name: 'Brown Rice (1 cup)', protein:  5, carbs: 45, fat:  2 },
  { name: 'Egg (1 large)',      protein:  6, carbs:  0, fat:  5 },
  { name: 'Banana (medium)',    protein:  1, carbs: 27, fat:  0 },
  { name: 'Protein Shake',      protein: 25, carbs:  5, fat:  2 },
  { name: 'Greek Yogurt 150g',  protein: 15, carbs:  6, fat:  1 },
  { name: 'Almonds 30g',        protein:  6, carbs:  6, fat: 15 },
  { name: 'Oatmeal (1 cup)',    protein:  6, carbs: 27, fat:  3 },
]

// ── Progress bar component ─────────────────────────────────────
function MacroBar({ label, eaten, target, unit = 'g', color }) {
  const pct      = target > 0 ? Math.min((eaten / target) * 100, 100) : 0
  const over     = eaten > target
  const remain   = target - eaten
  const barColor = over ? '#f87171' : pct > 85 ? '#4ade80' : color

  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 5 }}>
        <span style={{ color: '#bbb', fontWeight: 600 }}>{label}</span>
        <span style={{ color: over ? '#f87171' : '#888' }}>
          <strong style={{ color: '#fff', fontSize: 15 }}>{eaten}</strong>
          <span style={{ color: '#555' }}> / {target}{unit}</span>
          {over
            ? <span style={{ color: '#f87171', marginLeft: 8, fontSize: 12 }}>+{eaten - target} over</span>
            : <span style={{ color: '#555', marginLeft: 8, fontSize: 12 }}>{remain}{unit} left</span>
          }
        </span>
      </div>
      <div style={{ height: 8, background: '#1e1e1e', borderRadius: 6, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: barColor, borderRadius: 6, transition: 'width 0.3s ease' }} />
      </div>
    </div>
  )
}

// ── Main page ──────────────────────────────────────────────────
export default function Macros() {
  const targets = getTargets()

  const [dateOffset, setDateOffset]   = useState(0)
  const [log,        setLog]          = useState(loadLog)
  const [showPresets, setShowPresets] = useState(false)
  const [form,       setForm]         = useState({ name: '', protein: '', carbs: '', fat: '' })
  const [error,      setError]        = useState('')

  const date    = todayStr(dateOffset)
  const entries = log[date] || []

  const totals = entries.reduce(
    (acc, e) => ({ protein: acc.protein + e.protein, carbs: acc.carbs + e.carbs, fat: acc.fat + e.fat }),
    { protein: 0, carbs: 0, fat: 0 }
  )
  const totalKcal = Math.round(totals.protein * 4 + totals.carbs * 4 + totals.fat * 9)

  const addEntry = (entry) => {
    const newEntry = { ...entry, id: Date.now(), protein: +entry.protein, carbs: +entry.carbs, fat: +entry.fat }
    const updated  = { ...log, [date]: [...entries, newEntry] }
    setLog(updated)
    saveLog(updated)
  }

  const removeEntry = (id) => {
    const updated = { ...log, [date]: entries.filter(e => e.id !== id) }
    setLog(updated)
    saveLog(updated)
  }

  const handleCustomAdd = () => {
    if (!form.name.trim())                   { setError('Enter a food name'); return }
    if (form.protein === '' && form.carbs === '' && form.fat === '') { setError('Enter at least one macro value'); return }
    addEntry({ name: form.name, protein: form.protein || 0, carbs: form.carbs || 0, fat: form.fat || 0 })
    setForm({ name: '', protein: '', carbs: '', fat: '' })
    setError('')
  }

  const isToday    = dateOffset === 0
  const isYesterday = dateOffset === -1

  return (
    <section>
      {/* Header + date nav */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
        <h2 style={{ margin: 0 }}>🍽️ Macro Logger</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button onClick={() => setDateOffset(d => d - 1)} style={navBtn}>‹</button>
          <span style={{ fontSize: 13, color: '#bbb', minWidth: 110, textAlign: 'center' }}>
            {isToday ? 'Today' : isYesterday ? 'Yesterday' : fmtDate(date)}
          </span>
          <button onClick={() => setDateOffset(d => Math.min(d + 1, 0))} disabled={isToday} style={{ ...navBtn, opacity: isToday ? 0.3 : 1 }}>›</button>
        </div>
      </div>

      {/* Target source note */}
      <p style={{ color: '#555', fontSize: 12, marginTop: 6 }}>
        Targets from your Calculator · Goal: <span style={{ color: '#e879f9' }}>{targets.goal}</span>
        {' · '}{targets.weight}kg
        {' · '}
        <span
          style={{ color: '#e879f9', cursor: 'pointer', textDecoration: 'underline' }}
          onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: 'calculator' }))}
        >
          Edit in Calculator →
        </span>
      </p>

      {/* Macro progress bars */}
      <div className="card" style={{ marginTop: 12 }}>
        <MacroBar label="Calories" eaten={totalKcal}    target={targets.kcal}    unit=" kcal" color="#fb923c" />
        <MacroBar label="Protein"  eaten={totals.protein} target={targets.protein} color="#e879f9" />
        <MacroBar label="Carbs"    eaten={totals.carbs}   target={targets.carbs}   color="#60a5fa" />
        <MacroBar label="Fat"      eaten={totals.fat}     target={targets.fat}     color="#4ade80" />
      </div>

      {/* Quick-add presets */}
      <div className="card" style={{ marginTop: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: showPresets ? 12 : 0 }}>
          <h3 style={{ margin: 0, fontSize: 14 }}>⚡ Quick Add</h3>
          <button
            onClick={() => setShowPresets(s => !s)}
            style={{ background: 'none', border: '1px solid #333', color: '#bbb', padding: '4px 12px', borderRadius: 8, cursor: 'pointer', fontSize: 12 }}
          >
            {showPresets ? 'Hide' : 'Show meals'}
          </button>
        </div>
        {showPresets && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {PRESETS.map(p => (
              <button
                key={p.name}
                onClick={() => { addEntry(p); setShowPresets(false) }}
                style={{
                  background: '#1a1a1a', border: '1px solid #2a2a2a', color: '#ccc',
                  padding: '6px 12px', borderRadius: 8, cursor: 'pointer', fontSize: 12,
                  textAlign: 'left', lineHeight: 1.4
                }}
              >
                <div style={{ fontWeight: 600 }}>{p.name}</div>
                <div style={{ color: '#555', fontSize: 11 }}>P{p.protein} C{p.carbs} F{p.fat}</div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Custom add form */}
      <div className="card" style={{ marginTop: 14 }}>
        <h3 style={{ margin: '0 0 12px', fontSize: 14 }}>✏️ Log Custom Food</h3>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <input
            className="input" placeholder="Food name" value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            style={{ flex: '2 1 140px' }}
          />
          <input
            className="input" type="number" placeholder="Protein (g)" value={form.protein}
            onChange={e => setForm(f => ({ ...f, protein: e.target.value }))}
            style={{ flex: '1 1 90px' }}
          />
          <input
            className="input" type="number" placeholder="Carbs (g)" value={form.carbs}
            onChange={e => setForm(f => ({ ...f, carbs: e.target.value }))}
            style={{ flex: '1 1 80px' }}
          />
          <input
            className="input" type="number" placeholder="Fat (g)" value={form.fat}
            onChange={e => setForm(f => ({ ...f, fat: e.target.value }))}
            style={{ flex: '1 1 70px' }}
            onKeyDown={e => e.key === 'Enter' && handleCustomAdd()}
          />
          <button
            onClick={handleCustomAdd}
            style={{ background: '#e879f9', border: 'none', color: '#000', padding: '0 18px', borderRadius: 8, fontWeight: 700, cursor: 'pointer', fontSize: 14 }}
          >
            + Add
          </button>
        </div>
        {error && <p style={{ color: '#f87171', fontSize: 12, marginTop: 8 }}>{error}</p>}
      </div>

      {/* Food log */}
      <div className="card" style={{ marginTop: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h3 style={{ margin: 0, fontSize: 14 }}>📋 {isToday ? "Today's" : fmtDate(date)} Log</h3>
          <span style={{ color: '#555', fontSize: 12 }}>{entries.length} item{entries.length !== 1 ? 's' : ''} · {totalKcal} kcal</span>
        </div>

        {entries.length === 0 ? (
          <p style={{ color: '#444', fontSize: 13, textAlign: 'center', padding: '16px 0' }}>No food logged yet — add something above!</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ color: '#555', borderBottom: '1px solid #222' }}>
                <th style={{ textAlign: 'left', paddingBottom: 8 }}>Food</th>
                <th style={{ textAlign: 'center', paddingBottom: 8 }}>P</th>
                <th style={{ textAlign: 'center', paddingBottom: 8 }}>C</th>
                <th style={{ textAlign: 'center', paddingBottom: 8 }}>F</th>
                <th style={{ textAlign: 'center', paddingBottom: 8 }}>kcal</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {entries.map(e => (
                <tr key={e.id} style={{ borderBottom: '1px solid #1a1a1a' }}>
                  <td style={{ padding: '8px 0', color: '#fff' }}>{e.name}</td>
                  <td style={{ textAlign: 'center', color: '#e879f9' }}>{e.protein}g</td>
                  <td style={{ textAlign: 'center', color: '#60a5fa' }}>{e.carbs}g</td>
                  <td style={{ textAlign: 'center', color: '#4ade80' }}>{e.fat}g</td>
                  <td style={{ textAlign: 'center', color: '#fb923c' }}>{Math.round(e.protein * 4 + e.carbs * 4 + e.fat * 9)}</td>
                  <td style={{ textAlign: 'right' }}>
                    <button onClick={() => removeEntry(e.id)} style={{ background: 'none', border: 'none', color: '#333', cursor: 'pointer', fontSize: 16 }}>×</button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr style={{ borderTop: '1px solid #333' }}>
                <td style={{ padding: '8px 0', color: '#888', fontSize: 12 }}>Total</td>
                <td style={{ textAlign: 'center', color: '#e879f9', fontWeight: 700 }}>{totals.protein}g</td>
                <td style={{ textAlign: 'center', color: '#60a5fa', fontWeight: 700 }}>{totals.carbs}g</td>
                <td style={{ textAlign: 'center', color: '#4ade80', fontWeight: 700 }}>{totals.fat}g</td>
                <td style={{ textAlign: 'center', color: '#fb923c', fontWeight: 700 }}>{totalKcal}</td>
                <td />
              </tr>
            </tfoot>
          </table>
        )}
      </div>
    </section>
  )
}

const navBtn = {
  background: 'none', border: '1px solid #333', color: '#bbb',
  width: 32, height: 32, borderRadius: 8, cursor: 'pointer', fontSize: 18,
  display: 'flex', alignItems: 'center', justifyContent: 'center'
}
