import { useEffect, useMemo, useState } from 'react'
import useAsync from '../hooks/useAsync.js'
import { createWorkout, deleteWorkout, fetchWorkouts } from '../utils/api.js'
import { formatForDisplay } from '../utils/date.js'
import WorkoutDetail from '../components/WorkoutDetail.jsx'
import WorkoutComposer from '../components/WorkoutComposer.jsx'
import { ROUTES } from '../hooks/useRoute.js'

export default function WorkoutsPage({ onNavigate }) {
  const { data, isLoading, error, refetch } = useAsync(fetchWorkouts, [])
  const workouts = useMemo(() => data?.workouts ?? [], [data])
  const [selectedId, setSelectedId] = useState(null)
  const [isComposerOpen, setIsComposerOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    if (!isComposerOpen && workouts.length > 0 && !selectedId) {
      setSelectedId(workouts[0].id)
    }
  }, [isComposerOpen, selectedId, workouts])

  const selectedWorkout = useMemo(() => workouts.find((workout) => workout.id === selectedId), [selectedId, workouts])

  async function handleCreate(payload) {
    await createWorkout(payload)
    setIsComposerOpen(false)
    await refetch()
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this workout? Data helps you make better decisions.')) {
      return
    }
    setIsDeleting(true)
    try {
      await deleteWorkout(id)
      await refetch()
      setSelectedId(null)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="page workouts">
      <section className="panel list-panel">
        <div className="panel-header">
          <div>
            <h3>Your Workouts</h3>
            <p>Every rep logged is proof of consistency.</p>
          </div>
          <div className="panel-actions">
            <button type="button" className="ghost-button" onClick={() => setIsComposerOpen((state) => !state)}>
              {isComposerOpen ? 'Close composer' : 'New workout'}
            </button>
            <button type="button" className="ghost-button" onClick={() => onNavigate?.(ROUTES.dashboard)}>
              View analytics
            </button>
          </div>
        </div>
        {isLoading && <p className="panel-empty">Loading your sessions...</p>}
        {error && <p className="form-error">{error.message}</p>}
        {!isLoading && workouts.length === 0 && <p className="panel-empty">No workouts yet—log your first session!</p>}
        <ul className="workout-list">
          {workouts.map((workout) => {
            const isActive = selectedId === workout.id
            return (
              <li key={workout.id}>
                <button type="button" className={`workout-item ${isActive ? 'active' : ''}`} onClick={() => setSelectedId(workout.id)}>
                  <div>
                    <p className="workout-title">{workout.title}</p>
                    <p className="workout-meta">{workout.goal}</p>
                  </div>
                  <div className="workout-meta">
                    <span>{formatForDisplay(workout.workoutDate)}</span>
                    <span>{workout.exercises.length} exercises</span>
                  </div>
                </button>
                <button
                  type="button"
                  className="ghost-button danger"
                  onClick={() => handleDelete(workout.id)}
                  disabled={isDeleting}
                >
                  Delete
                </button>
              </li>
            )
          })}
        </ul>
      </section>

      <div className="workout-layout">
        {isComposerOpen ? (
          <WorkoutComposer onSubmit={handleCreate} onCancel={() => setIsComposerOpen(false)} />
        ) : (
          <WorkoutDetail workout={selectedWorkout} />
        )}
      </div>
    </div>
  )
}
