import useAsync from '../hooks/useAsync.js'
import { fetchSummary, fetchReminders } from '../utils/api.js'
import MetricCard from '../components/MetricCard.jsx'
import WeeklyVolumeChart from '../components/WeeklyVolumeChart.jsx'
import MuscleBreakdown from '../components/MuscleBreakdown.jsx'
import RecentSessions from '../components/RecentSessions.jsx'

export default function DashboardPage() {
  const { data: summary, isLoading } = useAsync(fetchSummary, [])
  const { data: remindersData } = useAsync(fetchReminders, [])

  const reminders = remindersData?.reminders?.slice(0, 3) || []

  return (
    <div className="page dashboard">
      <section className="panel hero">
        <div>
          <p className="hero-kicker">AI-assisted progress tracking</p>
          <h2>Operate like an athlete, iterate like an engineer.</h2>
          <p className="hero-copy">
            Brogram combines data, design, and discipline so you can showcase your engineering craft and your commitment to
            growth. Log with intention, analyze with clarity, and stay accountable.
          </p>
        </div>
        <div className="hero-badges">
          <span>📊 Volume Analytics</span>
          <span>🤖 Smart Suggestions</span>
          <span>🌓 Adaptive Theme</span>
        </div>
      </section>

      <section className="metrics-grid">
        <MetricCard icon="🏆" label="Total Sessions" value={isLoading ? '…' : summary?.totalWorkouts ?? 0} caption="Consistency is your unfair advantage." />
        <MetricCard icon="📦" label="Volume Moved" value={isLoading ? '…' : `${summary?.totalVolume ?? 0} lbs`} caption="Strength built set by set." />
        <MetricCard icon="⏱️" label="Minutes Trained" value={isLoading ? '…' : summary?.totalDuration ?? 0} caption="Time under tension drives adaptation." />
        <MetricCard icon="🔥" label="Best Streak" value={isLoading ? '…' : `${summary?.streak ?? 0} days`} caption="Protect the momentum." />
      </section>

      <section className="dashboard-grid">
        <WeeklyVolumeChart data={summary?.weeklyVolume || []} />
        <MuscleBreakdown data={summary?.muscleGroupVolume || []} />
      </section>

      <section className="dashboard-grid">
        <RecentSessions workouts={summary?.recentSessions || []} />
        <div className="panel">
          <div className="panel-header">
            <h3>Upcoming Reminders</h3>
            <p>Your accountability co-pilot.</p>
          </div>
          {reminders.length === 0 ? (
            <p className="panel-empty">Schedule a reminder to stay on pace.</p>
          ) : (
            <ul className="reminder-list">
              {reminders.map((reminder) => (
                <li key={reminder.id}>
                  <div>
                    <p className="reminder-title">{reminder.title}</p>
                    <p className="reminder-caption">{reminder.description}</p>
                  </div>
                  <span className="reminder-time">{reminder.timeOfDay}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  )
}
