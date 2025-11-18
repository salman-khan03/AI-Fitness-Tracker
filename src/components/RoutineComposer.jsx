import { useState } from 'react'

export default function RoutineComposer({ onSubmit }) {
  const [title, setTitle] = useState('Strength Foundation Phase')
  const [focus, setFocus] = useState('Hypertrophy')
  const [difficulty, setDifficulty] = useState('Intermediate')
  const [description, setDescription] = useState('A balanced split prioritizing compound lifts and progressive overload.')
  const [weeks, setWeeks] = useState(8)
  const [error, setError] = useState(null)

  async function handleSubmit(event) {
    event.preventDefault()
    if (!title.trim()) {
      setError('Give your routine a title that communicates the mission.')
      return
    }
    try {
      setError(null)
      await onSubmit({ title, focus, difficulty, description, weeks, workouts: [] })
      setTitle('Strength Foundation Phase')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <form className="panel composer" onSubmit={handleSubmit}>
      <div className="panel-header">
        <div>
          <h3>Create a Routine Blueprint</h3>
          <p>Design a repeatable plan to keep your training strategic.</p>
        </div>
      </div>
      {error && <p className="form-error">{error}</p>}
      <div className="form-grid">
        <label>
          <span>Title</span>
          <input value={title} onChange={(event) => setTitle(event.target.value)} />
        </label>
        <label>
          <span>Focus</span>
          <input value={focus} onChange={(event) => setFocus(event.target.value)} />
        </label>
        <label>
          <span>Difficulty</span>
          <select value={difficulty} onChange={(event) => setDifficulty(event.target.value)}>
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
          </select>
        </label>
        <label>
          <span>Duration (weeks)</span>
          <input type="number" value={weeks} onChange={(event) => setWeeks(Number(event.target.value))} />
        </label>
        <label className="form-notes">
          <span>Description</span>
          <textarea value={description} rows={3} onChange={(event) => setDescription(event.target.value)} />
        </label>
      </div>
      <div className="composer-actions">
        <button type="submit" className="primary-button">
          Save routine
        </button>
      </div>
    </form>
  )
}
