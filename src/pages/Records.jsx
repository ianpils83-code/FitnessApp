import React, { useState } from 'react'

const PR_KEY  = 'ff_prs'
const loadPRs = () => { try { return JSON.parse(localStorage.getItem(PR_KEY)) || {} } catch { return {} } }
const savePRs = (data) => localStorage.setItem(PR_KEY, JSON.stringify(data))

export default function Records() {
  const [prs,      setPRs]      = useState(loadPRs)
  const [expanded, setExpanded] = useState(null)

  const entries = Object.entries(prs).sort((a, b) =>
    (b[1].current?.date || '').localeCompare(a[1].current?.date || '')
  )

  const deletePR = (name) => {
    if (!window.confirm(`Delete all records for ${name}?`)) return
    const next = { ...prs }
    delete next[name]
    setPRs(next)
    savePRs(next)
  }

  const fmtBest = (entry) => {
    if (!entry) return '—'
    const w = entry.weight ? `${entry.weight}kg × ` : ''
    return `${w}${entry.reps} reps`
  }

  if (entries.length === 0) {
    return (
      <section>
        <h2>🏅 Personal Records</h2>
        <div className="card" style={{ marginTop: 16, textAlign: 'center', padding: '48px 24px' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🏋️</div>
          <h3 style={{ color: '#bbb', fontWeight: 400 }}>No records yet</h3>
          <p style={{ color: '#555' }}>
            Head to the <strong style={{ color: '#e879f9' }}>Library</strong> and tap
            <strong style={{ color: '#e879f9' }}> 🏅 Log PR</strong> on any exercise to get started.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
        <h2 style={{ margin: 0 }}>🏅 Personal Records</h2>
        <span style={{ color: '#555', fontSize: 13 }}>{entries.length} exercise{entries.length !== 1 ? 's' : ''} tracked</span>
      </div>

      {/* Summary stat cards */}
      <div style={{ display: 'flex', gap: 12, marginTop: 16, flexWrap: 'wrap' }}>
        {[
          { label: 'Exercises Tracked', value: entries.length, color: '#e879f9' },
          { label: 'Total Attempts',    value: entries.reduce((s, [, v]) => s + (v.history?.length || 0), 0), color: '#4ade80' },
          { label: 'Latest PR',         value: entries[0]?.[0] || '—', color: '#fb923c' },
        ].map(s => (
          <div key={s.label} className="card" style={{ flex: '1 1 120px', textAlign: 'center', padding: '12px 8px' }}>
            <div style={{ color: '#666', fontSize: 11, marginBottom: 4 }}>{s.label}</div>
            <div style={{ color: s.color, fontSize: s.label === 'Latest PR' ? 14 : 22, fontWeight: 700 }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* PR list */}
      <div style={{ marginTop: 16 }}>
        {entries.map(([name, data]) => {
          const isOpen = expanded === name
          const hist   = data.history || []
          const best   = data.current

          return (
            <div key={name} style={{ marginBottom: 10 }}>
              {/* PR row */}
              <div
                className="card"
                style={{ cursor: 'pointer', padding: '14px 16px' }}
                onClick={() => setExpanded(isOpen ? null : name)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                  {/* Exercise name + best */}
                  <div style={{ flex: 1, minWidth: 120 }}>
                    <div style={{ fontWeight: 700, fontSize: 15 }}>{name}</div>
                    <div style={{ color: '#555', fontSize: 12, marginTop: 2 }}>{hist.length} attempt{hist.length !== 1 ? 's' : ''}</div>
                  </div>

                  {/* Best PR */}
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ color: '#e879f9', fontWeight: 700, fontSize: 16 }}>{fmtBest(best)}</div>
                    <div style={{ color: '#555', fontSize: 11, marginTop: 2 }}>{best?.date}</div>
                  </div>

                  {/* Expand + delete */}
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <button
                      onClick={e => { e.stopPropagation(); deletePR(name) }}
                      style={{ background: 'none', border: 'none', color: '#444', cursor: 'pointer', fontSize: 16 }}
                      title="Delete record"
                    >🗑</button>
                    <span style={{ color: '#555', fontSize: 13 }}>{isOpen ? '▲' : '▼'}</span>
                  </div>
                </div>
              </div>

              {/* History accordion */}
              {isOpen && (
                <div style={{
                  border: '1px solid #333', borderTop: 'none',
                  borderRadius: '0 0 10px 10px', padding: '12px 16px', background: '#0d0d0d'
                }}>
                  <div style={{ color: '#666', fontSize: 12, marginBottom: 10 }}>📋 Attempt History (last 10)</div>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                    <thead>
                      <tr style={{ color: '#555', borderBottom: '1px solid #222' }}>
                        <th style={{ textAlign: 'left',   paddingBottom: 6 }}>Date</th>
                        <th style={{ textAlign: 'center', paddingBottom: 6 }}>Weight</th>
                        <th style={{ textAlign: 'center', paddingBottom: 6 }}>Reps</th>
                        <th style={{ textAlign: 'center', paddingBottom: 6 }}>Note</th>
                      </tr>
                    </thead>
                    <tbody>
                      {hist.map((h, i) => {
                        const isBest = h.date === best?.date && h.reps === best?.reps && h.weight === best?.weight
                        return (
                          <tr key={i} style={{ borderBottom: '1px solid #1a1a1a' }}>
                            <td style={{ padding: '7px 0', color: '#bbb' }}>{h.date}</td>
                            <td style={{ textAlign: 'center', color: '#bbb' }}>{h.weight ? `${h.weight}kg` : '—'}</td>
                            <td style={{ textAlign: 'center', color: isBest ? '#e879f9' : '#bbb', fontWeight: isBest ? 700 : 400 }}>
                              {h.reps}
                            </td>
                            <td style={{ textAlign: 'center', fontSize: 14 }}>{isBest ? '🏅' : ''}</td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}
