import React from 'react'

export default function Diet(){
  return (
    <section>
      <h2>Diet Guidance</h2>
      <div className="card" style={{marginTop:12}}>
        <h3>Principles</h3>
        <ul style={{color:'#ccc'}}>
          <li>Calories drive weight change — track and adjust.</li>
          <li>Protein is critical: 1.6–2.2 g/kg to preserve/build muscle.</li>
          <li>Favor whole foods: lean proteins, vegetables, whole grains, healthy fats.</li>
          <li>Prioritize sleep, hydration, and consistent meal timing.</li>
        </ul>

        <h3 style={{marginTop:10}}>Sample Targets</h3>
        <div style={{color:'#ccc'}}>For fat loss: modest deficit (-300 to -500 kcal). For muscle: slight surplus (+200 to +400 kcal).</div>

        <h3 style={{marginTop:10}}>Macro Examples</h3>
        <div style={{color:'#ccc'}}>A 75kg trainee aiming to build muscle: ~150g protein, 70–90g fat, remaining calories from carbs.</div>
      </div>
    </section>
  )
}
