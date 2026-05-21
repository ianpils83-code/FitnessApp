import React from 'react'

const lsGet = (k, fb) => { try { const v = localStorage.getItem(k); return v !== null ? JSON.parse(v) : fb } catch { return fb } }

const getTargets = () => {
  const weight = lsGet('ff_weight', null)
  const goal   = lsGet('ff_goal',   null)
  return { weight, goal }
}

export default function Diet({ setPage }) {
  const { weight, goal } = getTargets()
  const hasTargets = weight && goal

  return (
    <section>
      <h2>Diet Guidance</h2>

      {/* Personalised banner if calculator is set up */}
      {hasTargets ? (
        <div style={{ background: '#e879f922', border: '1px solid #e879f944', borderRadius: 12, padding: '14px 18px', marginTop: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
          <div>
            <div style={{ fontWeight: 700, color: '#e879f9', marginBottom: 4 }}>
              ✅ Your targets are set
            </div>
            <div style={{ color: '#bbb', fontSize: 13 }}>
              Weight: <strong style={{ color: '#fff' }}>{weight}kg</strong>
              {' · '}Goal: <strong style={{ color: '#fff' }}>{goal === 'lose' ? 'Lose Fat' : goal === 'gain' ? 'Gain Muscle' : 'Maintain'}</strong>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={() => setPage('macros')}
              style={{ background: '#e879f9', border: 'none', color: '#000', padding: '8px 16px', borderRadius: 8, fontWeight: 700, cursor: 'pointer', fontSize: 13 }}
            >
              🍽️ Log Today's Food
            </button>
            <button
              onClick={() => setPage('calculator')}
              style={{ background: 'none', border: '1px solid #444', color: '#ccc', padding: '8px 14px', borderRadius: 8, cursor: 'pointer', fontSize: 13 }}
            >
              Edit Targets
            </button>
          </div>
        </div>
      ) : (
        <div style={{ background: '#fb923c22', border: '1px solid #fb923c44', borderRadius: 12, padding: '14px 18px', marginTop: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
          <div style={{ color: '#fb923c', fontWeight: 600 }}>
            ⚠️ Set up your Calculator first to get personalised targets
          </div>
          <button
            onClick={() => setPage('calculator')}
            style={{ background: '#fb923c', border: 'none', color: '#000', padding: '8px 16px', borderRadius: 8, fontWeight: 700, cursor: 'pointer', fontSize: 13 }}
          >
            Go to Calculator →
          </button>
        </div>
      )}

      {/* Principles */}
      <div className="card" style={{ marginTop: 16 }}>
        <h3 style={{ marginTop: 0 }}>📌 Core Principles</h3>
        <ul style={{ paddingLeft: 18, lineHeight: 1.8 }}>
          <li>Calories drive weight change — track and adjust consistently.</li>
          <li>Protein is critical: <strong>1.6–2.2g/kg</strong> to preserve and build muscle.</li>
          <li>Favour whole foods: lean proteins, vegetables, whole grains, healthy fats.</li>
          <li>Prioritise sleep, hydration, and consistent meal timing.</li>
        </ul>
      </div>

      {/* Goal-specific guidance */}
      <div className="grid" style={{ marginTop: 16 }}>
        <div className="card">
          <h3 style={{ color: '#4ade80', marginTop: 0 }}>🔥 Fat Loss</h3>
          <ul style={{ paddingLeft: 18, lineHeight: 1.8, fontSize: 14 }}>
            <li>Aim for a <strong>–300 to –500 kcal</strong> daily deficit</li>
            <li>Keep protein high to prevent muscle loss</li>
            <li>Aim to lose <strong>0.5–1% bodyweight/week</strong></li>
            <li>Avoid crash diets — slow and steady wins</li>
          </ul>
        </div>
        <div className="card">
          <h3 style={{ color: '#e879f9', marginTop: 0 }}>💪 Muscle Gain</h3>
          <ul style={{ paddingLeft: 18, lineHeight: 1.8, fontSize: 14 }}>
            <li>Aim for a <strong>+200 to +400 kcal</strong> daily surplus</li>
            <li>Protein target: <strong>2.0g/kg</strong> bodyweight</li>
            <li>Progressive overload is the key driver</li>
            <li>Expect 0.25–0.5kg muscle gain/month (natural)</li>
          </ul>
        </div>
        <div className="card">
          <h3 style={{ color: '#60a5fa', marginTop: 0 }}>⚖️ Maintenance</h3>
          <ul style={{ paddingLeft: 18, lineHeight: 1.8, fontSize: 14 }}>
            <li>Match calories to TDEE (maintenance calories)</li>
            <li>Track weekly average weight — not daily</li>
            <li>Protein still important: <strong>1.6g/kg</strong> minimum</li>
            <li>Focus on body recomposition with strength training</li>
          </ul>
        </div>
      </div>

      {/* Quick food tips */}
      <div className="card" style={{ marginTop: 16 }}>
        <h3 style={{ marginTop: 0 }}>🍱 High-Protein SG Meal Ideas</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 10, marginTop: 8 }}>
          {[
            { food: 'Chicken Rice', p: '35g', tip: 'Skip the skin, double the chicken' },
            { food: 'Fish Soup Bee Hoon', p: '28g', tip: 'Low fat, high protein — great cut meal' },
            { food: 'Yong Tau Foo', p: '22g', tip: 'Choose tofu + fish options, clear soup' },
            { food: 'Sliced Fish Soup', p: '30g', tip: 'One of the best macro ratios in hawker' },
            { food: 'Protein Shake + Oats', p: '30g', tip: 'Fast pre/post-workout meal' },
            { food: 'Eggs (3 large)', p: '18g', tip: 'Cheap, versatile, nutrient-dense' },
          ].map(m => (
            <div key={m.food} style={{ background: '#ffffff08', borderRadius: 8, padding: '10px 12px' }}>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{m.food}</div>
              <div style={{ color: '#e879f9', fontSize: 12, margin: '2px 0' }}>~{m.p} protein</div>
              <div style={{ color: '#666', fontSize: 11 }}>{m.tip}</div>
            </div>
          ))}
        </div>
        <button
          onClick={() => setPage('macros')}
          style={{ marginTop: 16, width: '100%', background: '#e879f9', border: 'none', color: '#000', padding: '10px 0', borderRadius: 10, fontWeight: 700, cursor: 'pointer', fontSize: 14 }}
        >
          🍽️ Start Logging Meals →
        </button>
      </div>
    </section>
  )
}
