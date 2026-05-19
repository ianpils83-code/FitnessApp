import React, { useState } from 'react'

function round(n){return Math.round(n)}

export default function Calculator(){
  const [sex,setSex]=useState('male')
  const [age,setAge]=useState(30)
  const [weight,setWeight]=useState(75)
  const [height,setHeight]=useState(175)
  const [activity,setActivity]=useState(1.2)
  const [goal,setGoal]=useState('maintain')

  const bmr = sex === 'male'
    ? 10*weight + 6.25*height - 5*age + 5
    : 10*weight + 6.25*height - 5*age - 161

  const maintenance = round(bmr * activity)

  let target = maintenance
  if(goal==='lose') target = Math.round(maintenance - 500)
  if(goal==='gain') target = Math.round(maintenance + 300)

  const protein = Math.round(weight * (goal==='gain' ? 2.0 : 1.6))
  const fat = Math.round((target * 0.25) / 9)
  const carbs = Math.round((target - (protein*4 + fat*9)) / 4)

  return (
    <section>
      <h2>Calorie Calculator</h2>
      <div className="card" style={{marginTop:12}}>
        <div className="form-row">
          <label>Sex</label>
          <select value={sex} onChange={e=>setSex(e.target.value)} className="input">
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          <label>Age</label>
          <input className="input" type="number" value={age} onChange={e=>setAge(+e.target.value)} style={{width:80}} />
        </div>

        <div className="form-row" style={{marginTop:8}}>
          <label>Weight (kg)</label>
          <input className="input" type="number" value={weight} onChange={e=>setWeight(+e.target.value)} style={{width:100}} />
          <label>Height (cm)</label>
          <input className="input" type="number" value={height} onChange={e=>setHeight(+e.target.value)} style={{width:100}} />
        </div>

        <div className="form-row" style={{marginTop:8}}>
          <label>Activity</label>
          <select value={activity} onChange={e=>setActivity(+e.target.value)} className="input">
            <option value={1.2}>Sedentary</option>
            <option value={1.375}>Light</option>
            <option value={1.55}>Moderate</option>
            <option value={1.725}>Active</option>
            <option value={1.9}>Very Active</option>
          </select>
          <label>Goal</label>
          <select value={goal} onChange={e=>setGoal(e.target.value)} className="input">
            <option value="lose">Lose fat</option>
            <option value="maintain">Maintain</option>
            <option value="gain">Gain muscle</option>
          </select>
        </div>

        <div style={{marginTop:12,display:'flex',gap:12,alignItems:'center'}}>
          <div>
            <div style={{color:'#bbb'}}>Maintenance</div>
            <div style={{fontSize:24,fontWeight:700}}>{maintenance} kcal</div>
          </div>
          <div>
            <div style={{color:'#bbb'}}>Target</div>
            <div style={{fontSize:24,fontWeight:700}}>{target} kcal</div>
          </div>
          <div>
            <div style={{color:'#bbb'}}>Macros</div>
            <div>{protein}g protein • {fat}g fat • {carbs}g carbs</div>
          </div>
        </div>

        <p style={{marginTop:10,color:'#ccc'}}>Guidance: Aim for steady fat loss ~0.5-1% bodyweight/week. For muscle gain, prioritize progressive overload and a modest surplus.</p>
      </div>
    </section>
  )
}
