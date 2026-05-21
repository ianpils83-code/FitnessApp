import React, { useState } from 'react'
import ExerciseCard from '../components/ExerciseCard'
import exercises from '../data/exercises.json'

const muscles = ['All', 'Chest', 'Back', 'Legs', 'Core', 'Shoulders', 'Arms']

export default function Library() {
  const [search, setSearch] = useState('')
  const [muscle, setMuscle] = useState('All')

  const filtered = exercises.filter(e => {
    const matchMuscle = muscle === 'All' || e.muscle === muscle
    const matchSearch = e.name.toLowerCase().includes(search.toLowerCase())
    return matchMuscle && matchSearch
  })

  return (
    <section>
      <h2>Exercise Library</h2>
      <p style={{ color: '#ccc' }}>Browse movements with images and short notes.</p>

      {/* Search + Filter Bar */}
      <div style={{ display: 'flex', gap: 12, marginTop: 16, flexWrap: 'wrap' }}>
        <input
          className="input"
          type="text"
          placeholder="Search exercise..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ flex: 1, minWidth: 180 }}
        />
        <select
          className="input"
          value={muscle}
          onChange={e => setMuscle(e.target.value)}
        >
          {muscles.map(m => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </div>

      {/* Results Count */}
      <p style={{ color: '#888', marginTop: 10, fontSize: 14 }}>
        Showing {filtered.length} exercise{filtered.length !== 1 ? 's' : ''}
      </p>

      {/* Exercise Grid */}
      <div className="grid" style={{ marginTop: 8 }}>
        {filtered.length > 0
          ? filtered.map(e => <ExerciseCard key={e.id} exercise={e} />)
          : <p style={{ color: '#ccc' }}>No exercises found. Try a different search.</p>
        }
      </div>
    </section>
  )
}
