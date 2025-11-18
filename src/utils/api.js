const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000'

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    ...options
  })

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}))
    throw new Error(errorBody.error || 'Request failed')
  }

  if (response.status === 204) {
    return null
  }

  return response.json()
}

export function fetchSummary() {
  return request('/api/metrics/summary')
}

export function fetchWorkouts() {
  return request('/api/workouts')
}

export function fetchWorkout(id) {
  return request(`/api/workouts/${id}`)
}

export function createWorkout(payload) {
  return request('/api/workouts', {
    method: 'POST',
    body: JSON.stringify(payload)
  })
}

export function updateWorkout(id, payload) {
  return request(`/api/workouts/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload)
  })
}

export function deleteWorkout(id) {
  return request(`/api/workouts/${id}`, { method: 'DELETE' })
}

export function fetchRoutines() {
  return request('/api/routines')
}

export function createRoutine(payload) {
  return request('/api/routines', {
    method: 'POST',
    body: JSON.stringify(payload)
  })
}

export function fetchReminders() {
  return request('/api/reminders')
}

export function createReminder(payload) {
  return request('/api/reminders', {
    method: 'POST',
    body: JSON.stringify(payload)
  })
}

export function updateReminder(id, payload) {
  return request(`/api/reminders/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload)
  })
}

export function deleteReminder(id) {
  return request(`/api/reminders/${id}`, {
    method: 'DELETE'
  })
}
