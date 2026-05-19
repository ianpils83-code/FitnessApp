import React from 'react'

export default function Home(){
  return (
    <section>
      <div className="hero card">
        <div className="left">
          <h1>Train hard. Eat smart. Transform.</h1>
          <p>Personalized workout plans, an exercise library with images, a calorie calculator, and diet guidance — all in one bold app.</p>
        </div>
        <div className="right">
          <img src="/images/ex1.svg" alt="workout" style={{width:260}} />
        </div>
      </div>

      <h2 style={{marginTop:18}}>Quick Picks</h2>
      <div className="grid" style={{marginTop:12}}>
        <div className="card">
          <h3>Fat Loss Starter</h3>
          <p>Short, intense circuits to burn calories and build conditioning.</p>
        </div>
        <div className="card">
          <h3>Muscle Builder</h3>
          <p>Evidence-based hypertrophy split focused on progressive overload.</p>
        </div>
        <div className="card">
          <h3>Beginner Strength</h3>
          <p>Simple compound lifts and clear progressions.</p>
        </div>
      </div>
    </section>
  )
}
