export default function MuscleBreakdown({ data = [] }) {
  if (!data.length) {
    return (
      <div className="panel">
        <h3>Muscle Group Focus</h3>
        <p className="panel-empty">Add more sessions to unlock your training heatmap.</p>
      </div>
    )
  }

  const maxVolume = Math.max(...data.map((item) => item.volume)) || 1

  return (
    <div className="panel">
      <div className="panel-header">
        <h3>Muscle Group Focus</h3>
        <p>Ensure balanced development by tracking relative volume.</p>
      </div>
      <ul className="muscle-grid">
        {data.map((item) => {
          const percentage = Math.round((item.volume / maxVolume) * 100)
          return (
            <li key={item.name} className="muscle-row">
              <div className="muscle-label">
                <span>{item.name}</span>
              </div>
              <div className="muscle-bar">
                <span style={{ width: `${percentage}%` }} />
              </div>
              <span className="muscle-value">{item.volume}</span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
