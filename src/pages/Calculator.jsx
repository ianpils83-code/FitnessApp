import React, { useState } from 'react'

function round(n) { return Math.round(n) }

export default function Calculator() {
  const [sex, setSex] = useState('male')
  const [age, setAge] = useState(30)
  const [weight, setWeight] = useState(75)
  const [height, setHeight] = useState(175)
  const [activity, setActivity] = useState(1.2)
  const [goal, setGoal] = useState('maintain')

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
      <h2>Calorie Calculator</h2>
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
    </section>
  )
}
