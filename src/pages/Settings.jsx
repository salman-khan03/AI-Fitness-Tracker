import { useTheme } from '../theme/ThemeProvider.jsx'
import { fetchWorkouts } from '../utils/api.js'

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme()

  async function handleExport() {
    const data = await fetchWorkouts()
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = 'brogram-export.json'
    document.body.appendChild(anchor)
    anchor.click()
    document.body.removeChild(anchor)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="page settings">
      <section className="panel">
        <div className="panel-header">
          <div>
            <h3>Personal Settings</h3>
            <p>Control how Brogram presents your data during interviews and demos.</p>
          </div>
        </div>
        <div className="settings-grid">
          <div className="settings-card">
            <h4>Theme preference</h4>
            <p>Cycle through light, dark, and system to match the brand you want to present.</p>
            <button type="button" className="primary-button" onClick={toggleTheme}>
              Toggle theme (current: {theme})
            </button>
          </div>
          <div className="settings-card">
            <h4>Export data</h4>
            <p>Download your training history as JSON—perfect for analytics explorations.</p>
            <button type="button" className="ghost-button" onClick={handleExport}>
              Export workouts
            </button>
          </div>
          <div className="settings-card">
            <h4>Pitch ready tips</h4>
            <ul>
              <li>Emphasize the hybrid AI + fitness narrative.</li>
              <li>Walk recruiters through the data-driven design decisions.</li>
              <li>Demonstrate new workouts and reminders live.</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  )
}
