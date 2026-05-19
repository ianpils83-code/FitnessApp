import React from 'react'

export default function ExerciseCard({ exercise }){
  return (
    <article className="card exercise">
      <img src={exercise.img} alt={exercise.name} />
      <h3 style={{marginTop:10}}>{exercise.name}</h3>
      <div style={{color:'#bbb',fontSize:13}}>{exercise.muscle} • {exercise.equipment}</div>
    </article>
  )
}
