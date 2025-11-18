/* eslint-env node */
const WEEKDAY_LOOKUP = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export function formatISODate(value) {
  const date = new Date(value)
  return date.toISOString().slice(0, 10)
}

export function differenceInDays(previous, current) {
  const millis = previous.getTime() - current.getTime()
  return Math.round(millis / (1000 * 60 * 60 * 24))
}

export function groupByWeek(workouts) {
  const map = new Map()
  for (const workout of workouts) {
    const date = new Date(workout.isoDate)
    const week = buildWeekIdentifier(date)
    if (!map.has(week)) {
      map.set(week, [])
    }
    map.get(week).push(workout)
  }
  return Array.from(map.entries()).map(([week, sessions]) => ({ week, sessions })).sort((a, b) => (a.week < b.week ? -1 : 1))
}

export function buildWeekIdentifier(date) {
  const year = date.getUTCFullYear()
  const week = getWeekNumber(date)
  return `${year}-W${week.toString().padStart(2, '0')}`
}

export function getWeekNumber(date) {
  const temp = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()))
  const dayNum = temp.getUTCDay() || 7
  temp.setUTCDate(temp.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(temp.getUTCFullYear(), 0, 1))
  return Math.ceil(((temp - yearStart) / 86400000 + 1) / 7)
}

export function sortByDate(workouts) {
  return [...workouts].sort((a, b) => new Date(a.isoDate) - new Date(b.isoDate))
}

export function formatForDisplay(dateValue) {
  const date = new Date(dateValue)
  return `${WEEKDAY_LOOKUP[date.getDay()]} ${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1)
    .toString()
    .padStart(2, '0')}`
}
