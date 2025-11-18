import { ThemeProvider, useTheme } from './theme/ThemeProvider.jsx'
import { ROUTES, useRoute } from './hooks/useRoute.js'
import DashboardPage from './pages/Dashboard.jsx'
import WorkoutsPage from './pages/Workouts.jsx'
import RoutinesPage from './pages/Routines.jsx'
import RemindersPage from './pages/Reminders.jsx'
import SettingsPage from './pages/Settings.jsx'
import SidebarNav from './components/SidebarNav.jsx'
import AppHeader from './components/AppHeader.jsx'

const PAGE_MAP = {
  [ROUTES.dashboard]: DashboardPage,
  [ROUTES.workouts]: WorkoutsPage,
  [ROUTES.routines]: RoutinesPage,
  [ROUTES.reminders]: RemindersPage,
  [ROUTES.settings]: SettingsPage
}

function AppShell() {
  const { path, navigate } = useRoute()
  const PageComponent = PAGE_MAP[path] || DashboardPage
  const { theme } = useTheme()

  return (
    <div className={`app-shell ${theme}`.trim()}>
      <SidebarNav activePath={path} onNavigate={navigate} />
      <div className="app-main">
        <AppHeader onNavigate={navigate} />
        <main className="app-content">
          <PageComponent onNavigate={navigate} />
        </main>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <AppShell />
    </ThemeProvider>
  )
}
