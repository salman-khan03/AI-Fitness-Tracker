import { useTheme } from '../theme/ThemeProvider.jsx'
import { ROUTES } from '../hooks/useRoute.js'

const TITLES = {
  [ROUTES.dashboard]: 'Performance Command Center',
  [ROUTES.workouts]: 'Log & Learn from Every Session',
  [ROUTES.routines]: 'Program Designer',
  [ROUTES.reminders]: 'Accountability Hub',
  [ROUTES.settings]: 'Personal Control Room'
}

function useActiveTitle(pathname) {
  return TITLES[pathname] || 'Brogram'
}

export default function AppHeader({ onNavigate }) {
  const { theme, toggleTheme } = useTheme()
  const path = window.location.hash.replace('#', '') || ROUTES.dashboard
  const title = useActiveTitle(path)
  const now = new Date()

  return (
    <header className="app-header">
      <div>
        <p className="app-header-tag">Welcome back, builder 👋</p>
        <h1 className="app-header-title">{title}</h1>
      </div>
      <div className="app-header-actions">
        <div className="app-header-date">
          <span>{now.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}</span>
        </div>
        <button type="button" className="ghost-button" onClick={toggleTheme}>
          {theme === 'dark' ? '🌙 Dark' : theme === 'light' ? '☀️ Light' : '🌓 Auto'}
        </button>
        <button type="button" className="primary-button" onClick={() => onNavigate(ROUTES.workouts)}>
          + New Workout
        </button>
      </div>
    </header>
  )
}
