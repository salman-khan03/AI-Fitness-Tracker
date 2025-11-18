export default function MetricCard({ icon, label, value, caption }) {
  return (
    <div className="metric-card">
      <div className="metric-icon" aria-hidden>
        {icon}
      </div>
      <div>
        <p className="metric-value">{value}</p>
        <p className="metric-label">{label}</p>
        {caption && <p className="metric-caption">{caption}</p>}
      </div>
    </div>
  )
}
