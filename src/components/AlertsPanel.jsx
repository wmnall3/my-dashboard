const ICONS = {
  error: '!',
  warning: '!',
  success: '✓',
  info: 'i',
};

function AlertItem({ alert }) {
  return (
    <div className={`alert-item ${alert.type}`}>
      <div className="alert-icon">{ICONS[alert.type]}</div>
      <div className="alert-content">
        <div className="alert-message">{alert.message}</div>
        <div className="alert-meta">
          <span className="alert-category">{alert.category}</span>
          <span className="alert-time">{alert.time}</span>
        </div>
      </div>
    </div>
  );
}

export function AlertsPanel({ alerts }) {
  return (
    <div className="card">
      <div className="card-header">
        <div>
          <div className="card-title">Active Alerts</div>
          <div className="card-subtitle">{alerts.length} alerts requiring attention</div>
        </div>
      </div>
      <div className="card-body">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {alerts.map((alert) => (
            <AlertItem key={alert.id} alert={alert} />
          ))}
        </div>
      </div>
    </div>
  );
}
