/* eslint-env node */
import { differenceInDays, formatISODate, groupByWeek, sortByDate } from './date-helpers.js'

export function calculateSummary(workouts) {
  if (workouts.length === 0) {
    return {
      totalWorkouts: 0,
      totalVolume: 0,
      totalDuration: 0,
      averageEnergy: null,
      streak: 0,
      bestLifts: [],
      weeklyVolume: [],
      muscleGroupVolume: [],
      recentSessions: []
    }
  }

  const sessions = workouts.map((workout) => ({
    ...workout,
    isoDate: formatISODate(workout.workoutDate)
  }))
  const sortedSessions = sortByDate(sessions)

  let totalVolume = 0
  let totalDuration = 0
  let energyAccumulator = 0
  let energyCount = 0
  const maxByExercise = new Map()
  const muscleAccumulator = new Map()

  for (const workout of sortedSessions) {
    totalDuration += Number.isFinite(workout.durationMinutes) ? workout.durationMinutes : 0
    if (Number.isFinite(workout.energy)) {
      energyAccumulator += workout.energy
      energyCount += 1
    }

    for (const exercise of workout.exercises) {
      for (const set of exercise.sets) {
        if (Number.isFinite(set.weight) && Number.isFinite(set.reps)) {
          const volume = set.weight * set.reps
          totalVolume += volume
          const key = exercise.name.toLowerCase()
          const entry = maxByExercise.get(key)
          if (!entry || volume > entry.volume) {
            maxByExercise.set(key, {
              exercise: exercise.name,
              weight: set.weight,
              reps: set.reps,
              workoutDate: workout.isoDate,
              volume
            })
          }
          const mgKey = exercise.muscleGroup || 'Full Body'
          const mgEntry = muscleAccumulator.get(mgKey) || 0
          muscleAccumulator.set(mgKey, mgEntry + volume)
        }
      }
    }
  }

  const streak = calculateStreak(sortedSessions)
  const weeklyVolume = buildWeeklyVolume(sortedSessions)
  const muscleGroupVolume = Array.from(muscleAccumulator.entries()).map(([name, volume]) => ({ name, volume }))
  const bestLifts = Array.from(maxByExercise.values())

  return {
    totalWorkouts: workouts.length,
    totalVolume: Math.round(totalVolume),
    totalDuration: totalDuration,
    averageEnergy: energyCount ? +(energyAccumulator / energyCount).toFixed(1) : null,
    streak,
    bestLifts,
    weeklyVolume,
    muscleGroupVolume,
    recentSessions: sortedSessions.slice(-5).reverse()
  }
}

function calculateStreak(sortedSessions) {
  if (sortedSessions.length === 0) {
    return 0
  }
  let currentStreak = 1
  let longestStreak = 1
  for (let index = 1; index < sortedSessions.length; index += 1) {
    const previous = sortedSessions[index - 1]
    const current = sortedSessions[index]
    const distance = differenceInDays(new Date(previous.isoDate), new Date(current.isoDate))
    if (distance === 1) {
      currentStreak += 1
      longestStreak = Math.max(longestStreak, currentStreak)
    } else if (distance === 0) {
      continue
    } else {
      currentStreak = 1
    }
  }
  return longestStreak
}

function buildWeeklyVolume(workouts) {
  const grouped = groupByWeek(workouts)
  return grouped.map((item) => {
    let volume = 0
    for (const workout of item.sessions) {
      for (const exercise of workout.exercises) {
        for (const set of exercise.sets) {
          if (Number.isFinite(set.weight) && Number.isFinite(set.reps)) {
            volume += set.weight * set.reps
          }
        }
      }
    }
    return {
      week: item.week,
      volume: Math.round(volume),
      sessions: item.sessions.length
    }
  })
}
