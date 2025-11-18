/* eslint-env node */
import { getDatabase } from './lib/storage.js'
import { formatForDisplay } from './lib/date-helpers.js'

const UPCOMING_WINDOW_MINUTES = 30
let intervalId = null

export function startReminderScheduler() {
  if (intervalId) {
    clearInterval(intervalId)
  }
  intervalId = setInterval(checkReminders, 60 * 1000)
  checkReminders()
}

function checkReminders() {
  const { reminders } = getDatabase()
  if (!Array.isArray(reminders) || reminders.length === 0) {
    return
  }
  const now = new Date()
  for (const reminder of reminders) {
    if (!reminder.isActive) {
      continue
    }
    if (isReminderDue(reminder, now)) {
      const readable = formatForDisplay(now)
      console.log(`🔔 Reminder: ${reminder.title} scheduled for ${readable} at ${reminder.timeOfDay}`)
    }
  }
}

function isReminderDue(reminder, referenceDate) {
  const [hours, minutes] = reminder.timeOfDay.split(':').map((value) => Number.parseInt(value, 10))
  const reminderDate = new Date(referenceDate)
  reminderDate.setHours(hours)
  reminderDate.setMinutes(minutes)
  reminderDate.setSeconds(0)
  const diffMinutes = Math.abs(reminderDate.getTime() - referenceDate.getTime()) / (1000 * 60)
  if (diffMinutes > UPCOMING_WINDOW_MINUTES) {
    return false
  }
  if (reminder.cadence.type === 'weekly') {
    const weekday = reminderDate.toLocaleDateString('en-US', { weekday: 'short' })
    return reminder.cadence.days.includes(weekday)
  }
  if (reminder.cadence.type === 'custom') {
    const created = new Date(reminder.createdAt)
    const diff = Math.abs(referenceDate.getTime() - created.getTime()) / (1000 * 60 * 60 * 24)
    return diff % reminder.cadence.intervalDays < 1
  }
  return false
}
