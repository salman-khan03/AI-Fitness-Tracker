import { ROUTES } from '../hooks/useRoute.js'
import { useTheme } from '../theme/ThemeProvider.jsx'

const NAV_ITEMS = [
  { label: 'Dashboard', path: ROUTES.dashboard, icon: '📈', description: 'Progress intelligence' },
  { label: 'Workouts', path: ROUTES.workouts, icon: '💪', description: 'Log every rep' },
  { label: 'Routines', path: ROUTES.routines, icon: '🧭', description: 'Structured programs' },
  { label: 'Reminders', path: ROUTES.reminders, icon: '⏰', description: 'Stay accountable' },
  { label: 'Settings', path: ROUTES.settings, icon: '⚙️', description: 'Personalize the stack' }
]

export default function SidebarNav({ activePath, onNavigate }) {
  const { theme } = useTheme()
  return (
    <aside className={`sidebar ${theme}`}>
      <div className="sidebar-brand">
        <span className="sidebar-logo">🏋️‍♂️</span>
        <div>
          <p className="sidebar-title">Brogram</p>
          <p className="sidebar-subtitle">AI Fitness OS</p>
        </div>
      </div>
      <nav className="sidebar-nav">
        {NAV_ITEMS.map((item) => {
          const isActive = activePath === item.path
          return (
            <button
              key={item.path}
              type="button"
              onClick={() => onNavigate(item.path)}
              className={`sidebar-link ${isActive ? 'active' : ''}`.trim()}
            >
              <span className="sidebar-icon" aria-hidden>{item.icon}</span>
              <span>
                <span className="sidebar-link-label">{item.label}</span>
                <span className="sidebar-link-caption">{item.description}</span>
              </span>
            </button>
          )
        })}
      </nav>
      <footer className="sidebar-footer">
        <p>Built to showcase product thinking, clean engineering, and relentless progress.</p>
        <p className="sidebar-footer-tag">Internship ready · 2025</p>
      </footer>
    </aside>
  )
}
