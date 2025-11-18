/* eslint-env node */
import process from 'node:process'
import { sendJson, sendNoContent, readRequestBody, parseJson, createHttpError } from './lib/utils.js'
import {
  createWorkout,
  createRoutine,
  createReminder,
  deleteReminder,
  deleteRoutine,
  deleteWorkout,
  getDatabase,
  updateReminder,
  updateRoutine,
  updateWorkout
} from './lib/storage.js'
import { calculateSummary } from './lib/analytics.js'
import { formatISODate } from './lib/date-helpers.js'

function extractId(pathname) {
  const segments = pathname.split('/').filter(Boolean)
  return segments[segments.length - 1]
}

function normalizeQuery(urlObj) {
  const params = Object.fromEntries(urlObj.searchParams.entries())
  const normalized = {}
  if (params.from) {
    normalized.from = formatISODate(params.from)
  }
  if (params.to) {
    normalized.to = formatISODate(params.to)
  }
  if (params.search) {
    normalized.search = params.search.toLowerCase()
  }
  if (params.limit) {
    normalized.limit = Number.parseInt(params.limit, 10)
  }
  return normalized
}

export async function handleRequest(req, res, urlObj) {
  const { pathname } = urlObj
  if (req.method === 'OPTIONS') {
    return sendNoContent(res)
  }

  try {
    if (req.method === 'GET' && pathname === '/api/health') {
      return sendJson(res, 200, { status: 'ok', uptime: process.uptime() })
    }

    if (pathname.startsWith('/api/workouts')) {
      if (req.method === 'GET' && pathname === '/api/workouts') {
        return handleListWorkouts(res, normalizeQuery(urlObj))
      }
      if (req.method === 'POST' && pathname === '/api/workouts') {
        return handleCreateWorkout(req, res)
      }
      if (req.method === 'GET') {
        return handleGetWorkout(res, extractId(pathname))
      }
      if (req.method === 'PUT' || req.method === 'PATCH') {
        return handleUpdateWorkout(req, res, extractId(pathname))
      }
      if (req.method === 'DELETE') {
        return handleDeleteWorkout(res, extractId(pathname))
      }
    }

    if (pathname.startsWith('/api/metrics')) {
      if (req.method === 'GET' && pathname === '/api/metrics/summary') {
        return handleMetricsSummary(res, normalizeQuery(urlObj))
      }
    }

    if (pathname.startsWith('/api/routines')) {
      if (req.method === 'GET' && pathname === '/api/routines') {
        const data = getDatabase().routines
        return sendJson(res, 200, { routines: data })
      }
      if (req.method === 'POST' && pathname === '/api/routines') {
        return handleCreateRoutine(req, res)
      }
      if (req.method === 'PUT' || req.method === 'PATCH') {
        return handleUpdateRoutine(req, res, extractId(pathname))
      }
      if (req.method === 'DELETE') {
        return handleDeleteRoutine(res, extractId(pathname))
      }
    }

    if (pathname.startsWith('/api/reminders')) {
      if (req.method === 'GET' && pathname === '/api/reminders') {
        const data = getDatabase().reminders
        return sendJson(res, 200, { reminders: data })
      }
      if (req.method === 'POST' && pathname === '/api/reminders') {
        return handleCreateReminder(req, res)
      }
      if (req.method === 'PATCH') {
        return handleUpdateReminder(req, res, extractId(pathname))
      }
      if (req.method === 'DELETE') {
        return handleDeleteReminder(res, extractId(pathname))
      }
    }

    throw createHttpError(404, 'Route not found')
  } catch (error) {
    const statusCode = error.statusCode || 500
    return sendJson(res, statusCode, {
      error: error.message || 'Unexpected error'
    })
  }
}

async function handleListWorkouts(res, filters) {
  const db = getDatabase()
  let workouts = [...db.workouts]
  if (filters.from) {
    workouts = workouts.filter((item) => item.workoutDate >= filters.from)
  }
  if (filters.to) {
    workouts = workouts.filter((item) => item.workoutDate <= filters.to)
  }
  if (filters.search) {
    workouts = workouts.filter((item) => item.title.toLowerCase().includes(filters.search))
  }
  workouts.sort((a, b) => (a.workoutDate < b.workoutDate ? 1 : -1))
  if (Number.isFinite(filters.limit) && filters.limit > 0) {
    workouts = workouts.slice(0, filters.limit)
  }
  return sendJson(res, 200, { workouts })
}

async function handleCreateWorkout(req, res) {
  const body = await readRequestBody(req)
  const payload = parseJson(body)
  validateWorkoutPayload(payload)
  const workout = await createWorkout(payload)
  return sendJson(res, 201, { workout })
}

async function handleGetWorkout(res, id) {
  const workout = getDatabase().workouts.find((item) => item.id === id)
  if (!workout) {
    throw createHttpError(404, 'Workout not found')
  }
  return sendJson(res, 200, { workout })
}

async function handleUpdateWorkout(req, res, id) {
  const body = await readRequestBody(req)
  const payload = parseJson(body)
  const workout = await updateWorkout(id, payload)
  if (!workout) {
    throw createHttpError(404, 'Workout not found')
  }
  return sendJson(res, 200, { workout })
}

async function handleDeleteWorkout(res, id) {
  const success = await deleteWorkout(id)
  if (!success) {
    throw createHttpError(404, 'Workout not found')
  }
  return sendNoContent(res)
}

async function handleMetricsSummary(res, filters) {
  const db = getDatabase()
  let workouts = [...db.workouts]
  if (filters.from) {
    workouts = workouts.filter((item) => item.workoutDate >= filters.from)
  }
  if (filters.to) {
    workouts = workouts.filter((item) => item.workoutDate <= filters.to)
  }
  const summary = calculateSummary(workouts)
  return sendJson(res, 200, summary)
}

async function handleCreateRoutine(req, res) {
  const body = await readRequestBody(req)
  const payload = parseJson(body)
  if (!payload.title) {
    throw createHttpError(400, 'Routine title is required')
  }
  const routine = await createRoutine(payload)
  return sendJson(res, 201, { routine })
}

async function handleUpdateRoutine(req, res, id) {
  const body = await readRequestBody(req)
  const payload = parseJson(body)
  const routine = await updateRoutine(id, payload)
  if (!routine) {
    throw createHttpError(404, 'Routine not found')
  }
  return sendJson(res, 200, { routine })
}

async function handleDeleteRoutine(res, id) {
  const success = await deleteRoutine(id)
  if (!success) {
    throw createHttpError(404, 'Routine not found')
  }
  return sendNoContent(res)
}

async function handleCreateReminder(req, res) {
  const body = await readRequestBody(req)
  const payload = parseJson(body)
  if (!payload.title) {
    throw createHttpError(400, 'Reminder title is required')
  }
  const reminder = await createReminder(payload)
  return sendJson(res, 201, { reminder })
}

async function handleUpdateReminder(req, res, id) {
  const body = await readRequestBody(req)
  const payload = parseJson(body)
  const reminder = await updateReminder(id, payload)
  if (!reminder) {
    throw createHttpError(404, 'Reminder not found')
  }
  return sendJson(res, 200, { reminder })
}

async function handleDeleteReminder(res, id) {
  const success = await deleteReminder(id)
  if (!success) {
    throw createHttpError(404, 'Reminder not found')
  }
  return sendNoContent(res)
}

function validateWorkoutPayload(payload) {
  if (!payload.title) {
    throw createHttpError(400, 'Workout title is required')
  }
  if (!payload.workoutDate) {
    throw createHttpError(400, 'Workout date is required')
  }
  if (!Array.isArray(payload.exercises) || payload.exercises.length === 0) {
    throw createHttpError(400, 'At least one exercise is required')
  }
  for (const exercise of payload.exercises) {
    if (!exercise.name) {
      throw createHttpError(400, 'Exercise name is required')
    }
    if (!Array.isArray(exercise.sets) || exercise.sets.length === 0) {
      throw createHttpError(400, 'Exercises must include at least one set')
    }
  }
}
