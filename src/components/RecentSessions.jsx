import { formatForDisplay } from '../utils/date.js'

export default function RecentSessions({ workouts = [] }) {
  if (!workouts.length) {
    return (
      <div className="panel">
        <h3>Recent Sessions</h3>
        <p className="panel-empty">Log a workout to populate your momentum timeline.</p>
      </div>
    )
  }

  return (
    <div className="panel">
      <div className="panel-header">
        <h3>Recent Sessions</h3>
        <p>Every log is a data point—review your notes and adjust.</p>
      </div>
      <ul className="session-list">
        {workouts.map((workout) => (
          <li key={workout.id} className="session-item">
            <div>
              <p className="session-title">{workout.title}</p>
              <p className="session-meta">{workout.goal}</p>
            </div>
            <div className="session-meta">
              <span>{formatForDisplay(workout.workoutDate)}</span>
              <span>⚡ {workout.energy ?? '—'}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
