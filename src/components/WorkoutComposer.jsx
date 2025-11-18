import { useState } from 'react'
import { todayISO } from '../utils/date.js'

const MUSCLE_GROUPS = ['Chest', 'Back', 'Shoulders', 'Arms', 'Legs', 'Core', 'Full Body']

const EMPTY_EXERCISE = () => ({
  name: '',
  muscleGroup: 'Full Body',
  type: 'strength',
  sets: [
    { order: 1, weight: '', reps: '', rir: '' }
  ]
})

export default function WorkoutComposer({ onSubmit, onCancel }) {
  const [title, setTitle] = useState('Progressive Push Session')
  const [goal, setGoal] = useState('Progressive overload focus')
  const [workoutDate, setWorkoutDate] = useState(todayISO())
  const [durationMinutes, setDurationMinutes] = useState(60)
  const [energy, setEnergy] = useState(8)
  const [notes, setNotes] = useState('Focus on smooth tempo and controlled negatives.')
  const [exercises, setExercises] = useState([EMPTY_EXERCISE()])
  const [error, setError] = useState(null)

  function updateExercise(index, updates) {
    setExercises((current) => {
      const next = [...current]
      next[index] = { ...next[index], ...updates }
      return next
    })
  }

  function updateSet(exIndex, setIndex, updates) {
    setExercises((current) => {
      const next = [...current]
      const target = next[exIndex]
      const sets = [...target.sets]
      sets[setIndex] = { ...sets[setIndex], ...updates }
      next[exIndex] = { ...target, sets }
      return next
    })
  }

  function addExercise() {
    setExercises((current) => [...current, EMPTY_EXERCISE()])
  }

  function removeExercise(index) {
    setExercises((current) => current.filter((_, idx) => idx !== index))
  }

  function addSet(exIndex) {
    setExercises((current) => {
      const next = [...current]
      const target = next[exIndex]
      const sets = [
        ...target.sets,
        { order: target.sets.length + 1, weight: '', reps: '', rir: '' }
      ]
      next[exIndex] = { ...target, sets }
      return next
    })
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (!title.trim()) {
      setError('A workout title helps contextualize your session.')
      return
    }
    if (exercises.some((exercise) => !exercise.name.trim())) {
      setError('Every exercise needs a name.')
      return
    }
    if (exercises.some((exercise) => exercise.sets.length === 0)) {
      setError('Log at least one set per exercise.')
      return
    }

    const payload = {
      title,
      goal,
      workoutDate,
      durationMinutes: Number(durationMinutes),
      energy: Number(energy),
      notes,
      tags: ['custom'],
      exercises: exercises.map((exercise) => ({
        ...exercise,
        sets: exercise.sets.map((set, index) => ({
          order: index + 1,
          weight: set.weight ? Number(set.weight) : null,
          reps: set.reps ? Number(set.reps) : null,
          rir: set.rir ? Number(set.rir) : null
        }))
      }))
    }

    try {
      setError(null)
      await onSubmit(payload)
      setExercises([EMPTY_EXERCISE()])
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <form className="panel composer" onSubmit={handleSubmit}>
      <div className="panel-header">
        <div>
          <h3>Log a New Workout</h3>
          <p>Capture details, sets, and insights so future-you has data.</p>
        </div>
        {onCancel && (
          <button type="button" className="ghost-button" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>

      {error && <p className="form-error">{error}</p>}

      <div className="form-grid">
        <label>
          <span>Session title</span>
          <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="e.g. Push Power Hour" />
        </label>
        <label>
          <span>Training focus</span>
          <input value={goal} onChange={(event) => setGoal(event.target.value)} placeholder="What are you targeting?" />
        </label>
        <label>
          <span>Date</span>
          <input type="date" value={workoutDate} onChange={(event) => setWorkoutDate(event.target.value)} />
        </label>
        <label>
          <span>Duration (minutes)</span>
          <input type="number" value={durationMinutes} onChange={(event) => setDurationMinutes(event.target.value)} />
        </label>
        <label>
          <span>Energy (1-10)</span>
          <input type="number" value={energy} min="1" max="10" onChange={(event) => setEnergy(event.target.value)} />
        </label>
        <label className="form-notes">
          <span>Notes</span>
          <textarea value={notes} onChange={(event) => setNotes(event.target.value)} rows={3} />
        </label>
      </div>

      <section className="exercise-section">
        <div className="exercise-section-header">
          <h4>Exercises</h4>
          <button type="button" className="ghost-button" onClick={addExercise}>
            + Add exercise
          </button>
        </div>
        {exercises.map((exercise, index) => (
          <div key={index} className="exercise-form-block">
            <div className="exercise-form-grid">
              <label>
                <span>Name</span>
                <input value={exercise.name} onChange={(event) => updateExercise(index, { name: event.target.value })} />
              </label>
              <label>
                <span>Muscle group</span>
                <select value={exercise.muscleGroup} onChange={(event) => updateExercise(index, { muscleGroup: event.target.value })}>
                  {MUSCLE_GROUPS.map((group) => (
                    <option key={group} value={group}>
                      {group}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                <span>Type</span>
                <select value={exercise.type} onChange={(event) => updateExercise(index, { type: event.target.value })}>
                  <option value="strength">Strength</option>
                  <option value="accessory">Accessory</option>
                  <option value="conditioning">Conditioning</option>
                </select>
              </label>
            </div>
            <table className="set-table">
              <thead>
                <tr>
                  <th>Set</th>
                  <th>Weight</th>
                  <th>Reps</th>
                  <th>RIR</th>
                </tr>
              </thead>
              <tbody>
                {exercise.sets.map((set, setIndex) => (
                  <tr key={setIndex}>
                    <td>{setIndex + 1}</td>
                    <td>
                      <input
                        type="number"
                        value={set.weight}
                        onChange={(event) => updateSet(index, setIndex, { weight: event.target.value })}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={set.reps}
                        onChange={(event) => updateSet(index, setIndex, { reps: event.target.value })}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={set.rir}
                        onChange={(event) => updateSet(index, setIndex, { rir: event.target.value })}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="exercise-actions">
              <button type="button" className="ghost-button" onClick={() => addSet(index)}>
                + Add set
              </button>
              {exercises.length > 1 && (
                <button type="button" className="ghost-button danger" onClick={() => removeExercise(index)}>
                  Remove exercise
                </button>
              )}
            </div>
          </div>
        ))}
      </section>

      <div className="composer-actions">
        <button type="submit" className="primary-button">
          Save workout
        </button>
      </div>
    </form>
  )
}
