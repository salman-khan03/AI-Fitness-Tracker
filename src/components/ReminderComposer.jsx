import { useState } from 'react'

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export default function ReminderComposer({ onSubmit }) {
  const [title, setTitle] = useState('Morning training session')
  const [description, setDescription] = useState('Pack gym gear the night before and hydrate when you wake up.')
  const [timeOfDay, setTimeOfDay] = useState('06:00')
  const [days, setDays] = useState(['Mon', 'Wed', 'Fri'])
  const [error, setError] = useState(null)

  function toggleDay(day) {
    setDays((current) => (current.includes(day) ? current.filter((item) => item !== day) : [...current, day]))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (!title.trim()) {
      setError('Reminder title is required.')
      return
    }
    if (days.length === 0) {
      setError('Choose at least one training day.')
      return
    }
    try {
      setError(null)
      await onSubmit({
        title,
        description,
        timeOfDay,
        cadence: { type: 'weekly', days }
      })
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <form className="panel composer" onSubmit={handleSubmit}>
      <div className="panel-header">
        <div>
          <h3>Create Reminder</h3>
          <p>Automation keeps your habits on schedule.</p>
        </div>
      </div>
      {error && <p className="form-error">{error}</p>}
      <div className="form-grid">
        <label>
          <span>Title</span>
          <input value={title} onChange={(event) => setTitle(event.target.value)} />
        </label>
        <label className="form-notes">
          <span>Description</span>
          <textarea value={description} rows={3} onChange={(event) => setDescription(event.target.value)} />
        </label>
        <label>
          <span>Time</span>
          <input type="time" value={timeOfDay} onChange={(event) => setTimeOfDay(event.target.value)} />
        </label>
      </div>
      <div className="weekday-picker">
        {WEEKDAYS.map((day) => {
          const isActive = days.includes(day)
          return (
            <button
              key={day}
              type="button"
              className={`weekday ${isActive ? 'active' : ''}`}
              onClick={() => toggleDay(day)}
            >
              {day}
            </button>
          )
        })}
      </div>
      <div className="composer-actions">
        <button type="submit" className="primary-button">
          Save reminder
        </button>
      </div>
    </form>
  )
}
