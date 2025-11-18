/* eslint-env node */
import process from 'node:process'
import { access, mkdir, readFile, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { generateId, toISODate } from './utils.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const DATA_PATH = process.env.DATABASE_PATH || join(__dirname, '..', 'data', 'brogram.json')

let database = {
  workouts: [],
  routines: [],
  reminders: []
}

export async function initializeDatabase() {
  const dir = dirname(DATA_PATH)
  if (!existsSync(dir)) {
    await mkdir(dir, { recursive: true })
  }

  try {
    await access(DATA_PATH)
    const raw = await readFile(DATA_PATH, 'utf8')
    database = JSON.parse(raw)
  } catch {
    await persistDatabase()
  }
}

export function getDatabase() {
  return database
}

async function persistDatabase() {
  const payload = JSON.stringify(database, null, 2)
  await writeFile(DATA_PATH, payload, 'utf8')
}

export async function createWorkout(payload) {
  const timestamp = new Date().toISOString()
  const workout = {
    id: generateId('workout'),
    title: payload.title,
    goal: payload.goal || '',
    workoutDate: toISODate(payload.workoutDate || Date.now()),
    durationMinutes: Number.isFinite(payload.durationMinutes) ? payload.durationMinutes : 0,
    energy: Number.isFinite(payload.energy) ? payload.energy : null,
    mood: payload.mood || 'neutral',
    notes: payload.notes || '',
    tags: Array.isArray(payload.tags) ? payload.tags : [],
    exercises: normalizeExercises(payload.exercises || []),
    createdAt: timestamp,
    updatedAt: timestamp
  }
  database.workouts.push(workout)
  await persistDatabase()
  return workout
}

export async function updateWorkout(id, payload) {
  const index = database.workouts.findIndex((item) => item.id === id)
  if (index === -1) {
    return null
  }
  const existing = database.workouts[index]
  const updates = {
    ...existing,
    ...payload,
    workoutDate: payload.workoutDate ? toISODate(payload.workoutDate) : existing.workoutDate,
    exercises: payload.exercises ? normalizeExercises(payload.exercises) : existing.exercises,
    updatedAt: new Date().toISOString()
  }
  database.workouts[index] = updates
  await persistDatabase()
  return updates
}

export async function deleteWorkout(id) {
  const originalLength = database.workouts.length
  database.workouts = database.workouts.filter((item) => item.id !== id)
  if (database.workouts.length === originalLength) {
    return false
  }
  await persistDatabase()
  return true
}

export async function createRoutine(payload) {
  const timestamp = new Date().toISOString()
  const routine = {
    id: generateId('routine'),
    title: payload.title,
    focus: payload.focus || 'General',
    difficulty: payload.difficulty || 'Intermediate',
    description: payload.description || '',
    weeks: Number.isFinite(payload.weeks) ? payload.weeks : 4,
    workouts: Array.isArray(payload.workouts) ? payload.workouts : [],
    createdAt: timestamp,
    updatedAt: timestamp
  }
  database.routines.push(routine)
  await persistDatabase()
  return routine
}

export async function updateRoutine(id, payload) {
  const index = database.routines.findIndex((item) => item.id === id)
  if (index === -1) {
    return null
  }
  const existing = database.routines[index]
  const updates = {
    ...existing,
    ...payload,
    workouts: payload.workouts ? payload.workouts : existing.workouts,
    updatedAt: new Date().toISOString()
  }
  database.routines[index] = updates
  await persistDatabase()
  return updates
}

export async function deleteRoutine(id) {
  const originalLength = database.routines.length
  database.routines = database.routines.filter((item) => item.id !== id)
  if (database.routines.length === originalLength) {
    return false
  }
  await persistDatabase()
  return true
}

export async function createReminder(payload) {
  const timestamp = new Date().toISOString()
  const reminder = {
    id: generateId('reminder'),
    title: payload.title,
    description: payload.description || '',
    cadence: normalizeCadence(payload.cadence),
    timeOfDay: payload.timeOfDay || '07:00',
    isActive: payload.isActive ?? true,
    createdAt: timestamp,
    updatedAt: timestamp
  }
  database.reminders.push(reminder)
  await persistDatabase()
  return reminder
}

export async function updateReminder(id, payload) {
  const index = database.reminders.findIndex((item) => item.id === id)
  if (index === -1) {
    return null
  }
  const existing = database.reminders[index]
  const updates = {
    ...existing,
    ...payload,
    cadence: payload.cadence ? normalizeCadence(payload.cadence) : existing.cadence,
    updatedAt: new Date().toISOString()
  }
  database.reminders[index] = updates
  await persistDatabase()
  return updates
}

export async function deleteReminder(id) {
  const originalLength = database.reminders.length
  database.reminders = database.reminders.filter((item) => item.id !== id)
  if (database.reminders.length === originalLength) {
    return false
  }
  await persistDatabase()
  return true
}

function normalizeExercises(exercises) {
  return exercises.map((exercise) => {
    const sets = Array.isArray(exercise.sets) ? exercise.sets : []
    return {
      id: exercise.id || generateId('exercise'),
      name: exercise.name,
      muscleGroup: exercise.muscleGroup || 'Full Body',
      type: exercise.type || 'strength',
      notes: exercise.notes || '',
      sets: sets.map((set, index) => ({
        id: set.id || generateId('set'),
        order: Number.isFinite(set.order) ? set.order : index + 1,
        weight: Number.isFinite(set.weight) ? set.weight : null,
        reps: Number.isFinite(set.reps) ? set.reps : null,
        rir: Number.isFinite(set.rir) ? set.rir : null,
        distance: Number.isFinite(set.distance) ? set.distance : null,
        duration: Number.isFinite(set.duration) ? set.duration : null
      }))
    }
  })
}

function normalizeCadence(cadence) {
  if (!cadence) {
    return { type: 'weekly', days: ['Mon', 'Wed', 'Fri'] }
  }
  if (cadence.type === 'custom') {
    return {
      type: 'custom',
      intervalDays: Number.isFinite(cadence.intervalDays) ? cadence.intervalDays : 3
    }
  }
  if (cadence.type === 'weekly') {
    return {
      type: 'weekly',
      days: Array.isArray(cadence.days) && cadence.days.length > 0 ? cadence.days : ['Mon', 'Wed', 'Fri']
    }
  }
  return { type: 'weekly', days: ['Mon', 'Wed', 'Fri'] }
}

export async function saveDatabaseSnapshot(data) {
  database = data
  await persistDatabase()
}

export function getDataPath() {
  return DATA_PATH
}
