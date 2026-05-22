import React, { useState, useEffect } from 'react'

function round(n) { return Math.round(n) }

const load = (key, fallback) => {
  const v = localStorage.getItem(key)
  return v !== null ? JSON.parse(v) : fallback
}

export default function Calculator() {
  const [sex,      setSex]      = useState(() => load('ff_sex',      'male'))
  const [age,      setAge]      = useState(() => load('ff_age',      30))
  const [weight,   setWeight]   = useState(() => load('ff_weight',   75))
  const [height,   setHeight]   = useState(() => load('ff_height',   175))
  const [activity, setActivity] = useState(() => load('ff_activity', 1.2))
  const [goal,     setGoal]     = useState(() => load('ff_goal',     'maintain'))
  const [saved,    setSaved]    = useState(false)

  useEffect(() => {
    localStorage.setItem('ff_sex',      JSON.stringify(sex))
    localStorage.setItem('ff_age',      JSON.stringify(age))
    localStorage.setItem('ff_weight',   JSON.stringify(weight))
    localStorage.setItem('ff_height',   JSON.stringify(height))
    localStorage.setItem('ff_activity', JSON.stringify(activity))
    localStorage.setItem('ff_goal',     JSON.stringify(goal))
    setSaved(true)
    const t = setTimeout(() => setSaved(false), 1500)
    return () => clearTimeout(t)
  }, [sex, age, weight, height, activity, goal])

  const handleReset = () => {
    setSex('male'); setAge(30); setWeight(75)
    setHeight(175); setActivity(1.2); setGoal('maintain')
  }

  const bmr = sex === 'male'
    ? 10 * weight + 6.25 * height - 5 * age + 5
    : 10 * weight + 6.25 * height - 5 * age - 161

  const maintenance = round(bmr * activity)

  let target = maintenance
  if (goal === 'lose') target = Math.round(maintenance - 500)
  if (goal === 'gain') target = Math.round(maintenance + 300)

  const protein = Math.round(weight * (goal === 'gain' ? 2.0 : 1.6))
  const fat = Math.round((target * 0.25) / 9)
  const carbs = Math.round((target - (protein * 4 + fat * 9)) / 4)

  // BMI
  const heightM = height / 100
  const bmi = (weight / (heightM * heightM)).toFixed(1)
  const bmiCategory =
    bmi < 18.5 ? { label: 'Underweight', color: '#60a5fa' } :
    bmi < 25   ? { label: 'Normal',       color: '#4ade80' } :
    bmi < 30   ? { label: 'Overweight',   color: '#fb923c' } :
                 { label: 'Obese',         color: '#f87171' }

  return (
    <section>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <h2 style={{ margin: 0 }}>Calorie Calculator</h2>
        {saved && (
          <span style={{ color: '#4ade80', fontSize: 13, fontWeight: 600 }}>✓ Saved</span>
        )}
        <button
          onClick={handleReset}
          style={{
            marginLeft: 'auto', background: 'none', border: '1px solid #444',
            color: '#888', padding: '4px 12px', borderRadius: 8,
            cursor: 'pointer', fontSize: 13
          }}
        >
          Reset
        </button>
      </div>
      <div className="card" style={{ marginTop: 12 }}>

        <div className="form-row">
          <label>Sex</label>
          <select value={sex} onChange={e => setSex(e.target.value)} className="input">
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          <label>Age</label>
          <input className="input" type="number" value={age} onChange={e => setAge(+e.target.value)} style={{ width: 80 }} />
        </div>

        <div className="form-row" style={{ marginTop: 8 }}>
          <label>Weight (kg)</label>
          <input className="input" type="number" value={weight} onChange={e => setWeight(+e.target.value)} style={{ width: 100 }} />
          <label>Height (cm)</label>
          <input className="input" type="number" value={height} onChange={e => setHeight(+e.target.value)} style={{ width: 100 }} />
        </div>

        <div className="form-row" style={{ marginTop: 8 }}>
          <label>Activity</label>
          <select value={activity} onChange={e => setActivity(+e.target.value)} className="input">
            <option value={1.2}>Sedentary</option>
            <option value={1.375}>Light</option>
            <option value={1.55}>Moderate</option>
            <option value={1.725}>Active</option>
            <option value={1.9}>Very Active</option>
          </select>
          <label>Goal</label>
          <select value={goal} onChange={e => setGoal(e.target.value)} className="input">
            <option value="lose">Lose fat</option>
            <option value="maintain">Maintain</option>
            <option value="gain">Gain muscle</option>
          </select>
        </div>

        {/* Calorie Results */}
        <div style={{ marginTop: 16, display: 'flex', gap: 20, flexWrap: 'wrap', alignItems: 'center' }}>
          <div>
            <div style={{ color: '#bbb' }}>Maintenance</div>
            <div style={{ fontSize: 24, fontWeight: 700 }}>{maintenance} kcal</div>
          </div>
          <div>
            <div style={{ color: '#bbb' }}>Target</div>
            <div style={{ fontSize: 24, fontWeight: 700 }}>{target} kcal</div>
          </div>
          <div>
            <div style={{ color: '#bbb' }}>Macros</div>
            <div>{protein}g protein · {fat}g fat · {carbs}g carbs</div>
          </div>
        </div>

        {/* BMI Section */}
        <div style={{ marginTop: 20, borderTop: '1px solid #333', paddingTop: 16 }}>
          <div style={{ color: '#bbb', marginBottom: 6 }}>BMI (Body Mass Index)</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ fontSize: 32, fontWeight: 700, color: bmiCategory.color }}>{bmi}</div>
            <div style={{
              background: bmiCategory.color + '22',
              color: bmiCategory.color,
              padding: '4px 14px',
              borderRadius: 20,
              fontWeight: 600,
              fontSize: 15
            }}>
              {bmiCategory.label}
            </div>
          </div>
          <div style={{ color: '#777', fontSize: 13, marginTop: 6 }}>
            Underweight &lt;18.5 · Normal 18.5–24.9 · Overweight 25–29.9 · Obese ≥30
          </div>
        </div>

        <p style={{ marginTop: 12, color: '#ccc' }}>
          Guidance: Aim for steady fat loss ~0.5–1% bodyweight/week. For muscle gain, prioritize progressive overload and a modest surplus.
        </p>
      </div>

      {/* 1RM Calculator */}
      <OneRM />
    </section>
  )
}

// ── 1RM Calculator ─────────────────────────────────────────────
function OneRM() {
  const [w,    setW]    = React.useState('')
  const [reps, setReps] = React.useState('')

  const wN = parseFloat(w)
  const rN = parseInt(reps)
  const valid = !isNaN(wN) && !isNaN(rN) && wN > 0 && rN >= 1 && rN <= 30

  // Epley formula
  const epley = valid ? wN * (1 + rN / 30) : null

  const pcts = [1, 0.95, 0.9, 0.85, 0.8, 0.75, 0.7, 0.65]

  return (
    <div className="card" style={{ marginTop: 16 }}>
      <h3 style={{ marginTop: 0 }}>💪 1RM Calculator</h3>
      <p style={{ color: '#bbb', fontSize: 13, marginTop: 0 }}>
        Estimate your one-rep max from a sub-maximal lift. Use 3–10 reps for best accuracy.
      </p>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <div>
          <div style={{ color: '#bbb', fontSize: 13, marginBottom: 4 }}>Weight lifted (kg)</div>
          <input className="input" type="number" placeholder="e.g. 80" value={w} onChange={e => setW(e.target.value)} style={{ width: 120 }} />
        </div>
        <div>
          <div style={{ color: '#bbb', fontSize: 13, marginBottom: 4 }}>Reps completed</div>
          <input className="input" type="number" placeholder="e.g. 5" value={reps} onChange={e => setReps(e.target.value)} style={{ width: 100 }} min="1" max="30" />
        </div>
        {valid && (
          <div style={{ background: '#e879f922', border: '1px solid #e879f944', borderRadius: 10, padding: '8px 18px', textAlign: 'center' }}>
            <div style={{ fontSize: 11, color: '#bbb' }}>Estimated 1RM</div>
            <div style={{ fontSize: 26, fontWeight: 700, color: '#e879f9' }}>{epley.toFixed(1)} kg</div>
          </div>
        )}
      </div>

      {valid && (
        <div style={{ marginTop: 16 }}>
          <div style={{ color: '#bbb', fontSize: 13, marginBottom: 8 }}>Training percentages</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: 8 }}>
            {pcts.map(p => (
              <div key={p} style={{ background: '#ffffff08', borderRadius: 8, padding: '8px 10px', textAlign: 'center' }}>
                <div style={{ color: '#888', fontSize: 11 }}>{Math.round(p * 100)}%</div>
                <div style={{ fontWeight: 700, fontSize: 15, color: p === 1 ? '#e879f9' : '#fff' }}>
                  {(epley * p).toFixed(1)} kg
                </div>
              </div>
            ))}
          </div>
          <p style={{ color: '#555', fontSize: 12, marginTop: 10 }}>Formula: Epley — weight × (1 + reps ÷ 30)</p>
        </div>
      )}
    </div>
  )
}
