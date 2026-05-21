import React, { useState, useEffect, useRef } from 'react'

const PRESETS = [
  { label: '45s',  value: 45  },
  { label: '60s',  value: 60  },
  { label: '90s',  value: 90  },
  { label: '2min', value: 120 },
  { label: '3min', value: 180 },
]

const RADIUS = 50
const CIRC   = 2 * Math.PI * RADIUS  // ~314

function beep() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    ;[0, 0.35, 0.7].forEach(delay => {
      const osc  = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.type = 'sine'
      osc.frequency.value = 880
      gain.gain.setValueAtTime(0.4, ctx.currentTime + delay)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 0.28)
      osc.start(ctx.currentTime + delay)
      osc.stop(ctx.currentTime + delay + 0.3)
    })
  } catch (_) {}
}

export default function RestTimer() {
  const [open,      setOpen]      = useState(false)
  const [duration,  setDuration]  = useState(60)
  const [remaining, setRemaining] = useState(60)
  const [running,   setRunning]   = useState(false)
  const [done,      setDone]      = useState(false)
  const [muted,     setMuted]     = useState(false)
  const intervalRef = useRef(null)

  // Countdown tick
  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setRemaining(r => {
          if (r <= 1) {
            clearInterval(intervalRef.current)
            setRunning(false)
            setDone(true)
            if (!muted) beep()
            return 0
          }
          return r - 1
        })
      }, 1000)
    } else {
      clearInterval(intervalRef.current)
    }
    return () => clearInterval(intervalRef.current)
  }, [running, muted])

  const selectPreset = (val) => {
    clearInterval(intervalRef.current)
    setDuration(val)
    setRemaining(val)
    setRunning(false)
    setDone(false)
  }

  const toggle = () => {
    if (done) return
    setRunning(r => !r)
  }

  const reset = () => {
    clearInterval(intervalRef.current)
    setRemaining(duration)
    setRunning(false)
    setDone(false)
  }

  const mins = String(Math.floor(remaining / 60)).padStart(2, '0')
  const secs = String(remaining % 60).padStart(2, '0')
  const progress  = remaining / duration           // 1 → 0
  const dashOffset = CIRC * (1 - progress)

  // Ring colour: green → amber → red as time runs out
  const ringColor = progress > 0.5 ? '#4ade80' : progress > 0.2 ? '#fb923c' : '#f87171'

  return (
    <>
      {/* Floating toggle button */}
      <button
        onClick={() => setOpen(o => !o)}
        title="Rest Timer"
        style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 999,
          width: 52, height: 52, borderRadius: '50%',
          background: running ? '#e879f9' : done ? '#4ade80' : '#1e1e1e',
          border: '2px solid #333', cursor: 'pointer',
          fontSize: 22, display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 20px #0008', transition: 'background 0.3s'
        }}
      >
        {done ? '✅' : '⏱️'}
      </button>

      {/* Timer Panel */}
      {open && (
        <div style={{
          position: 'fixed', bottom: 86, right: 24, zIndex: 998,
          background: '#131313', border: '1px solid #333',
          borderRadius: 16, padding: 20, width: 260,
          boxShadow: '0 8px 32px #000a'
        }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <span style={{ fontWeight: 700, fontSize: 15 }}>⏱️ Rest Timer</span>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={() => setMuted(m => !m)}
                title={muted ? 'Unmute' : 'Mute'}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, color: muted ? '#555' : '#bbb' }}
              >
                {muted ? '🔇' : '🔔'}
              </button>
              <button
                onClick={() => setOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: '#555' }}
              >
                ×
              </button>
            </div>
          </div>

          {/* Preset buttons */}
          <div style={{ display: 'flex', gap: 6, marginBottom: 20, flexWrap: 'wrap' }}>
            {PRESETS.map(p => (
              <button
                key={p.value}
                onClick={() => selectPreset(p.value)}
                style={{
                  flex: '1 1 40px',
                  padding: '5px 0',
                  borderRadius: 8,
                  border: duration === p.value ? '1px solid #e879f9' : '1px solid #333',
                  background: duration === p.value ? '#e879f922' : '#1a1a1a',
                  color: duration === p.value ? '#e879f9' : '#bbb',
                  cursor: 'pointer', fontSize: 12, fontWeight: 600
                }}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Circular progress */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
            <svg width="130" height="130" viewBox="0 0 120 120">
              {/* Track */}
              <circle cx="60" cy="60" r={RADIUS}
                fill="none" stroke="#222" strokeWidth="8" />
              {/* Progress ring */}
              <circle cx="60" cy="60" r={RADIUS}
                fill="none"
                stroke={done ? '#4ade80' : ringColor}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={CIRC}
                strokeDashoffset={dashOffset}
                transform="rotate(-90 60 60)"
                style={{ transition: 'stroke-dashoffset 0.9s linear, stroke 0.5s' }}
              />
              {/* Time text */}
              <text x="60" y="56" textAnchor="middle"
                fill={done ? '#4ade80' : '#fff'}
                fontSize="22" fontWeight="700"
              >
                {done ? 'Done!' : `${mins}:${secs}`}
              </text>
              {!done && (
                <text x="60" y="74" textAnchor="middle" fill="#555" fontSize="11">
                  {running ? 'resting…' : remaining === duration ? 'ready' : 'paused'}
                </text>
              )}
            </svg>
          </div>

          {/* Controls */}
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={toggle}
              disabled={done}
              style={{
                flex: 2, padding: '10px 0', borderRadius: 10, border: 'none',
                background: done ? '#222' : running ? '#fb923c' : '#e879f9',
                color: done ? '#555' : '#000',
                fontWeight: 700, fontSize: 15, cursor: done ? 'not-allowed' : 'pointer',
                transition: 'background 0.2s'
              }}
            >
              {running ? '⏸ Pause' : done ? 'Done' : '▶ Start'}
            </button>
            <button
              onClick={reset}
              style={{
                flex: 1, padding: '10px 0', borderRadius: 10,
                border: '1px solid #333', background: '#1a1a1a',
                color: '#bbb', fontWeight: 600, fontSize: 14, cursor: 'pointer'
              }}
            >
              ↺ Reset
            </button>
          </div>
        </div>
      )}
    </>
  )
}
