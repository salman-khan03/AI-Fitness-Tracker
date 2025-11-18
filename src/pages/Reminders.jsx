import useAsync from '../hooks/useAsync.js'
import { createReminder, deleteReminder, fetchReminders, updateReminder } from '../utils/api.js'
import ReminderComposer from '../components/ReminderComposer.jsx'

export default function RemindersPage() {
  const { data, isLoading, error, refetch } = useAsync(fetchReminders, [])
  const reminders = data?.reminders || []

  async function handleCreate(payload) {
    await createReminder(payload)
    await refetch()
  }

  async function handleToggle(reminder) {
    await updateReminder(reminder.id, { isActive: !reminder.isActive })
    await refetch()
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this reminder?')) {
      return
    }
    await deleteReminder(id)
    await refetch()
  }

  return (
    <div className="page reminders">
      <section className="panel">
        <div className="panel-header">
          <div>
            <h3>Accountability Reminders</h3>
            <p>Automated nudges ensure your future self stays consistent.</p>
          </div>
        </div>
        {isLoading && <p className="panel-empty">Loading reminders…</p>}
        {error && <p className="form-error">{error.message}</p>}
        {!isLoading && reminders.length === 0 && <p className="panel-empty">No reminders yet—create one to stay on track.</p>}
        <ul className="reminder-list detailed">
          {reminders.map((reminder) => (
            <li key={reminder.id}>
              <div>
                <p className="reminder-title">{reminder.title}</p>
                <p className="reminder-caption">{reminder.description}</p>
                <p className="reminder-caption">{reminder.cadence.days.join(', ')} · {reminder.timeOfDay}</p>
              </div>
              <div className="reminder-actions">
                <button type="button" className="ghost-button" onClick={() => handleToggle(reminder)}>
                  {reminder.isActive ? 'Disable' : 'Activate'}
                </button>
                <button type="button" className="ghost-button danger" onClick={() => handleDelete(reminder.id)}>
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>
      <ReminderComposer onSubmit={handleCreate} />
    </div>
  )
}
