import React from 'react'

const plans = [
  {id:1,title:'Fat Loss Starter',desc:'4-week circuit program — 3x/week, focus on metabolic conditioning.'},
  {id:2,title:'Muscle Builder',desc:'8-week hypertrophy split — upper/lower structure, progressive overload.'},
  {id:3,title:'Beginner Strength',desc:'Classic 3x/week full-body program to build foundational strength.'}
]

export default function Plans(){
  return (
    <section>
      <h2>Workout Plans</h2>
      <div className="grid" style={{marginTop:12}}>
        {plans.map(p=> (
          <div key={p.id} className="card">
            <h3>{p.title}</h3>
            <p>{p.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
