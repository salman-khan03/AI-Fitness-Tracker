export function formatForDisplay(dateValue) {
  const date = new Date(dateValue)
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

export function toISODate(value) {
  const date = new Date(value)
  return date.toISOString().slice(0, 10)
}

export function todayISO() {
  return toISODate(new Date())
}
