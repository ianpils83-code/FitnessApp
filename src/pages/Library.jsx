import React from 'react'
import ExerciseCard from '../components/ExerciseCard'
import exercises from '../data/exercises.json'

export default function Library(){
  return (
    <section>
      <h2>Exercise Library</h2>
      <p style={{color:'#ccc'}}>Browse movements with images and short notes.</p>
      <div className="grid" style={{marginTop:12}}>
        {exercises.map(e => (
          <ExerciseCard key={e.id} exercise={e} />
        ))}
      </div>
    </section>
  )
}
