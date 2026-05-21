import React, { useState, useRef } from 'react'

const KEY = 'ff_progress'

const load = () => {
  try { return JSON.parse(localStorage.getItem(KEY)) || [] }
  catch { return [] }
}

const save = (entries) => localStorage.setItem(KEY, JSON.stringify(entries))

const today = () => new Date().toISOString().slice(0, 10)

// ── Export SVG chart as PNG ─────────────────────────────────────
const exportChart = (svgEl) => {
  if (!svgEl) return
  const W = 600, H = 220
  const svgStr = new XMLSerializer().serializeToString(svgEl)
  const blob   = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' })
  const url    = URL.createObjectURL(blob)
  const img    = new Image()
  img.onload = () => {
    const canvas = document.createElement('canvas')
    canvas.width  = W
    canvas.height = H
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#0b0b0b'
    ctx.fillRect(0, 0, W, H)
    ctx.drawImage(img, 0, 0, W, H)
    URL.revokeObjectURL(url)
    const a = document.createElement('a')
    a.download = `fitforge-progress-${new Date().toISOString().slice(0,10)}.png`
    a.href = canvas.toDataURL('image/png')
    a.click()
  }
  img.src = url
}

// ── SVG Line Chart ──────────────────────────────────────────────
function Chart({ entries, svgRef }) {
  if (entries.length < 2) return (
    <div style={{ textAlign: 'center', padding: '32px 0', color: '#555', fontSize: 14 }}>
      Add at least 2 entries to see your chart
    </div>
  )

  const W = 560, H = 180, PX = 44, PY = 20
  const weights = entries.map(e => e.weight)
  const minW = Math.min(...weights)
  const maxW = Math.max(...weights)
  const range = maxW - minW || 1

  const xs = i => PX + (i / (entries.length - 1)) * (W - PX * 2)
  const ys = w => PY + (1 - (w - minW) / range) * (H - PY * 2)

  const points = entries.map((e, i) => `${xs(i)},${ys(e.weight)}`).join(' ')
  const areaPoints = `${xs(0)},${H} ` + points + ` ${xs(entries.length - 1)},${H}`

  // Y axis labels
  const yLabels = [minW, minW + range * 0.5, maxW].map(v => v.toFixed(1))

  // X axis labels — show first, middle, last
  const xIndices = entries.length <= 5
    ? entries.map((_, i) => i)
    : [0, Math.floor(entries.length / 2), entries.length - 1]

  return (
    <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', display: 'block' }}>
      {/* Grid lines */}
      {[0, 0.5, 1].map((t, i) => (
        <line key={i}
          x1={PX} y1={PY + t * (H - PY * 2)}
          x2={W - PX} y2={PY + t * (H - PY * 2)}
          stroke="#222" strokeWidth="1"
        />
      ))}

      {/* Area fill */}
      <polygon points={areaPoints} fill="#e879f922" />

      {/* Line */}
      <polyline points={points} fill="none" stroke="#e879f9" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />

      {/* Data points */}
      {entries.map((e, i) => (
        <circle key={i} cx={xs(i)} cy={ys(e.weight)} r="4" fill="#e879f9" stroke="#0b0b0b" strokeWidth="2" />
      ))}

      {/* Y axis labels */}
      {yLabels.map((l, i) => (
        <text key={i}
          x={PX - 6} y={PY + (1 - i * 0.5) * (H - PY * 2) + 4}
          textAnchor="end" fill="#666" fontSize="11"
        >{l}</text>
      ))}

      {/* X axis labels */}
      {xIndices.map(i => (
        <text key={i}
          x={xs(i)} y={H - 2}
          textAnchor="middle" fill="#666" fontSize="10"
        >{entries[i].date.slice(5)}</text>
      ))}
    </svg>
  )
}

// ── Main Page ───────────────────────────────────────────────────
export default function Progress() {
  const [entries, setEntries] = useState(load)
  const [date,    setDate]    = useState(today)
  const [weight,  setWeight]  = useState('')
  const [error,   setError]   = useState('')
  const svgRef = useRef(null)

  const add = () => {
    const w = parseFloat(weight)
    if (!weight || isNaN(w) || w < 20 || w > 300) {
      setError('Enter a valid weight (20–300 kg)'); return
    }
    if (!date) { setError('Pick a date'); return }
    const next = [...entries, { date, weight: w }]
      .sort((a, b) => a.date.localeCompare(b.date))
    setEntries(next)
    save(next)
    setWeight('')
    setError('')
  }

  const remove = (i) => {
    const next = entries.filter((_, idx) => idx !== i)
    setEntries(next)
    save(next)
  }

  const clearAll = () => {
    if (!window.confirm('Clear all progress entries?')) return
    setEntries([])
    save([])
  }

  // Stats
  const weights   = entries.map(e => e.weight)
  const current   = weights.at(-1)
  const starting  = weights[0]
  const lowest    = weights.length ? Math.min(...weights) : null
  const change    = weights.length >= 2 ? (current - starting).toFixed(1) : null

  return (
    <section>
      <h2>Progress Tracker</h2>
      <p style={{ color: '#ccc' }}>Log your weight over time and track your trend.</p>

      {/* Stats Row */}
      {entries.length > 0 && (
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 16 }}>
          {[
            { label: 'Current',  value: `${current} kg`,   color: '#e879f9' },
            { label: 'Starting', value: `${starting} kg`,  color: '#bbb' },
            { label: 'Lowest',   value: `${lowest} kg`,    color: '#4ade80' },
            change !== null && {
              label: 'Change',
              value: `${change > 0 ? '+' : ''}${change} kg`,
              color: change < 0 ? '#4ade80' : change > 0 ? '#fb923c' : '#bbb'
            }
          ].filter(Boolean).map(s => (
            <div key={s.label} className="card" style={{ flex: '1 1 100px', textAlign: 'center', padding: '12px 8px' }}>
              <div style={{ color: '#888', fontSize: 12, marginBottom: 4 }}>{s.label}</div>
              <div style={{ color: s.color, fontSize: 22, fontWeight: 700 }}>{s.value}</div>
            </div>
          ))}
        </div>
      )}

      {/* Chart */}
      <div className="card" style={{ marginTop: 16, padding: '16px 8px' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
          {entries.length >= 2 && (
            <button
              onClick={() => exportChart(svgRef.current)}
              style={{
                background: 'none', border: '1px solid #333', color: '#888',
                padding: '4px 12px', borderRadius: 8, cursor: 'pointer', fontSize: 12
              }}
            >
              📥 Export as Image
            </button>
          )}
        </div>
        <Chart entries={entries} svgRef={svgRef} />
      </div>

      {/* Log Form */}
      <div className="card" style={{ marginTop: 16 }}>
        <h3 style={{ marginTop: 0 }}>Log Weight</h3>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div>
            <div style={{ color: '#bbb', fontSize: 13, marginBottom: 4 }}>Date</div>
            <input
              className="input" type="date"
              value={date} onChange={e => setDate(e.target.value)}
            />
          </div>
          <div>
            <div style={{ color: '#bbb', fontSize: 13, marginBottom: 4 }}>Weight (kg)</div>
            <input
              className="input" type="number" placeholder="e.g. 74.5"
              value={weight} onChange={e => setWeight(e.target.value)}
              style={{ width: 110 }}
              onKeyDown={e => e.key === 'Enter' && add()}
            />
          </div>
          <button
            onClick={add}
            style={{
              background: '#e879f9', color: '#000', border: 'none',
              padding: '8px 20px', borderRadius: 8, fontWeight: 700,
              cursor: 'pointer', fontSize: 14
            }}
          >
            + Add
          </button>
        </div>
        {error && <p style={{ color: '#f87171', fontSize: 13, marginTop: 8 }}>{error}</p>}
      </div>

      {/* Entry Log Table */}
      {entries.length > 0 && (
        <div className="card" style={{ marginTop: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h3 style={{ margin: 0 }}>Log ({entries.length} entries)</h3>
            <button
              onClick={clearAll}
              style={{ background: 'none', border: '1px solid #444', color: '#888', padding: '4px 12px', borderRadius: 8, cursor: 'pointer', fontSize: 13 }}
            >
              Clear All
            </button>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr style={{ color: '#888', borderBottom: '1px solid #333' }}>
                <th style={{ textAlign: 'left', paddingBottom: 8 }}>Date</th>
                <th style={{ textAlign: 'center', paddingBottom: 8 }}>Weight (kg)</th>
                <th style={{ textAlign: 'center', paddingBottom: 8 }}>Change</th>
                <th style={{ textAlign: 'center', paddingBottom: 8 }}></th>
              </tr>
            </thead>
            <tbody>
              {[...entries].reverse().map((e, ri) => {
                const i = entries.length - 1 - ri
                const prev = entries[i - 1]
                const diff = prev ? (e.weight - prev.weight).toFixed(1) : null
                return (
                  <tr key={i} style={{ borderBottom: '1px solid #1a1a1a' }}>
                    <td style={{ padding: '8px 0', color: '#fff' }}>{e.date}</td>
                    <td style={{ textAlign: 'center', color: '#e879f9', fontWeight: 600 }}>{e.weight}</td>
                    <td style={{ textAlign: 'center', color: diff === null ? '#555' : diff < 0 ? '#4ade80' : diff > 0 ? '#fb923c' : '#888' }}>
                      {diff === null ? '—' : `${diff > 0 ? '+' : ''}${diff} kg`}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <button
                        onClick={() => remove(i)}
                        style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: 16 }}
                        title="Delete"
                      >×</button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
