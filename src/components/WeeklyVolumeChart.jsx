const WIDTH = 640
const HEIGHT = 260
const PADDING = 40

export default function WeeklyVolumeChart({ data = [] }) {
  if (!data.length) {
    return (
      <div className="panel">
        <h3>Weekly Volume</h3>
        <p className="panel-empty">Log more workouts to unlock your progress graph.</p>
      </div>
    )
  }

  const maxVolume = Math.max(...data.map((item) => item.volume)) || 1
  const stepX = (WIDTH - PADDING * 2) / Math.max(data.length - 1, 1)

  const points = data.map((item, index) => {
    const x = PADDING + stepX * index
    const y = HEIGHT - PADDING - (item.volume / maxVolume) * (HEIGHT - PADDING * 2)
    return `${x},${y}`
  })

  const areaPath = `M${PADDING},${HEIGHT - PADDING} L${points.join(' ')} L${PADDING + stepX * (data.length - 1)},${HEIGHT - PADDING} Z`

  return (
    <div className="panel">
      <div className="panel-header">
        <h3>Weekly Volume</h3>
        <p>Track total weight moved per training week.</p>
      </div>
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="chart">
        <defs>
          <linearGradient id="volumeGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--chart-accent)" stopOpacity="0.8" />
            <stop offset="100%" stopColor="var(--chart-accent)" stopOpacity="0.1" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill="url(#volumeGradient)" stroke="var(--chart-accent)" strokeWidth="2" strokeLinejoin="round" />
        {data.map((item, index) => {
          const x = PADDING + stepX * index
          const y = HEIGHT - PADDING - (item.volume / maxVolume) * (HEIGHT - PADDING * 2)
          return (
            <g key={item.week}>
              <circle cx={x} cy={y} r="4" fill="var(--chart-accent)" />
              <text x={x} y={HEIGHT - PADDING + 18} textAnchor="middle" className="chart-label">
                {item.week.replace('2025-', '')}
              </text>
              <text x={x} y={y - 12} textAnchor="middle" className="chart-value">
                {item.volume}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}
