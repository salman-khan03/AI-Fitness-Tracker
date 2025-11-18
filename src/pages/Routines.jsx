import useAsync from '../hooks/useAsync.js'
import { createRoutine, fetchRoutines } from '../utils/api.js'
import RoutineComposer from '../components/RoutineComposer.jsx'

export default function RoutinesPage() {
  const { data, isLoading, error, refetch } = useAsync(fetchRoutines, [])
  const routines = data?.routines || []

  async function handleCreate(payload) {
    await createRoutine(payload)
    await refetch()
  }

  return (
    <div className="page routines">
      <section className="panel">
        <div className="panel-header">
          <div>
            <h3>Signature Routines</h3>
            <p>Showcase repeatable programming that keeps you progressing.</p>
          </div>
        </div>
        {isLoading && <p className="panel-empty">Loading routines…</p>}
        {error && <p className="form-error">{error.message}</p>}
        {!isLoading && routines.length === 0 && <p className="panel-empty">No routines yet—design one to stay intentional.</p>}
        <div className="routine-grid">
          {routines.map((routine) => (
            <article key={routine.id} className="routine-card">
              <header>
                <h4>{routine.title}</h4>
                <p>{routine.focus}</p>
              </header>
              <p className="routine-description">{routine.description}</p>
              <footer>
                <span>{routine.weeks} weeks</span>
                <span>{routine.difficulty}</span>
              </footer>
            </article>
          ))}
        </div>
      </section>
      <RoutineComposer onSubmit={handleCreate} />
    </div>
  )
}
