import { formatForDisplay } from '../utils/date.js'

export default function WorkoutDetail({ workout, onClose }) {
  if (!workout) {
    return (
      <div className="panel">
        <h3>Workout Detail</h3>
        <p className="panel-empty">Select a session to analyze volume, notes, and patterns.</p>
      </div>
    )
  }

  return (
    <div className="panel workout-detail">
      <div className="panel-header">
        <div>
          <h3>{workout.title}</h3>
          <p className="panel-subtitle">
            {formatForDisplay(workout.workoutDate)} · {workout.goal}
          </p>
        </div>
        {onClose && (
          <button type="button" className="ghost-button" onClick={onClose}>
            Close
          </button>
        )}
      </div>
      <div className="workout-detail-grid">
        {workout.exercises.map((exercise) => (
          <div key={exercise.id} className="exercise-block">
            <div className="exercise-header">
              <h4>{exercise.name}</h4>
              <span>{exercise.muscleGroup}</span>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Set</th>
                  <th>Weight</th>
                  <th>Reps</th>
                  <th>RIR</th>
                </tr>
              </thead>
              <tbody>
                {exercise.sets.map((set) => (
                  <tr key={set.id}>
                    <td>{set.order}</td>
                    <td>{set.weight ?? '—'}</td>
                    <td>{set.reps ?? '—'}</td>
                    <td>{set.rir ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
      {workout.notes && (
        <div className="notes-block">
          <h4>Coach Notes</h4>
          <p>{workout.notes}</p>
        </div>
      )}
    </div>
  )
}
