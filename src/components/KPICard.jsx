export function KPICard({ label, value, change, period, prefix = '' }) {
  const isPositive = parseFloat(change) >= 0;

  return (
    <div className="kpi-card">
      <div className="kpi-label">{label}</div>
      <div className="kpi-value">
        {prefix}{typeof value === 'number' ? value.toLocaleString() : value}
      </div>
      <div>
        <span className={`kpi-change ${isPositive ? 'positive' : 'negative'}`}>
          {isPositive ? '↑' : '↓'} {Math.abs(parseFloat(change))}%
        </span>
        <span className="kpi-period">{period}</span>
      </div>
    </div>
  );
}
